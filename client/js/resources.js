import { apiCall, requireAuth, showToast, showSkeleton } from './utils.js';

// Check authentication (allow access but show message if not logged in)
const isAuthenticated = requireAuth();
if (!isAuthenticated) {
  // Show message but allow access to view resources
  console.log('Not authenticated - login for personalized resources');
}

let currentCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
  // Category tabs
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentCategory = tab.dataset.category;
      loadResources();
    });
  });
  
  // Search
  const searchInput = document.getElementById('resources-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value;
        loadResources();
      }, 300);
    });
  }
  
  // Load resources
  await loadResources();
});

async function loadResources() {
  const container = document.getElementById('resources-container');
  if (!container) return;
  
  // Show loading state
  showSkeleton(container, 'card', 6);
  
  try {
    let endpoint = '/resources';
    const params = new URLSearchParams();
    if (currentCategory !== 'all') {
      params.append('category', currentCategory);
    }
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    if (params.toString()) {
      endpoint += '?' + params.toString();
    }
    
    const data = await apiCall(endpoint);
    
    if (!data.resources || data.resources.length === 0) {
      if (searchQuery) {
        container.innerHTML = `
          <div class="col-span-full text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No resources found</h3>
            <p class="text-gray-600 mb-6">We couldn't find any resources matching "${searchQuery}". Try a different search term or category.</p>
            <button onclick="document.getElementById('resources-search').value=''; document.getElementById('resources-search').dispatchEvent(new Event('input'));" class="btn-secondary">
              Clear Search
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="col-span-full text-center py-12">
            <div class="text-6xl mb-4">📚</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No resources available</h3>
            <p class="text-gray-600">Resources will be available soon. Check back later!</p>
          </div>
        `;
      }
      return;
    }
    
    container.innerHTML = data.resources.map(resource => `
      <article class="card resource-card" role="listitem">
        <div class="mb-4">
          <span class="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
            ${resource.type === 'video' ? '📹 Video' : '📄 Article'}
          </span>
        </div>
        <h3 class="font-semibold text-lg mb-2">${resource.title}</h3>
        <p class="text-gray-600 text-sm mb-4">${resource.excerpt}</p>
        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>⏱️ ${resource.readTime} min read</span>
          <span class="px-2 py-1 bg-gray-100 rounded">${resource.category}</span>
        </div>
        <button class="btn-secondary w-full view-resource" data-id="${resource.id}">
          Read More
        </button>
      </article>
    `).join('');
    
    // View resource buttons
    document.querySelectorAll('.view-resource').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        viewResource(id);
      });
    });
  } catch (error) {
    console.error('Error loading resources:', error);
    const container = document.getElementById('resources-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-6xl mb-4">😕</div>
          <h3 class="text-xl font-semibold text-red-600 mb-2">Unable to load resources</h3>
          <p class="text-gray-600 mb-6">${error.message || 'Please check your connection and try again.'}</p>
          <button onclick="location.reload()" class="btn-primary">Retry</button>
        </div>
      `;
    }
    showToast('Failed to load resources. Please try again.', 'error');
  }
}

async function viewResource(id) {
  try {
    const data = await apiCall(`/resources/${id}`);
    const resource = data.resource;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold">${resource.title}</h2>
            <button class="close-modal text-2xl text-gray-500 hover:text-gray-700">&times;</button>
          </div>
          <div class="mb-4 flex items-center space-x-4 text-sm text-gray-500">
            <span>⏱️ ${resource.readTime} min read</span>
            <span>Category: ${resource.category}</span>
          </div>
          <div class="prose max-w-none">
            <p class="text-gray-700 whitespace-pre-wrap">${resource.content}</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  } catch (error) {
    showToast(error.message || 'Failed to load resource', 'error');
  }
}


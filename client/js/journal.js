import { apiCall, requireAuth, showToast, formatDate, formatDateTime, showConfirmation, setButtonLoading, showSkeleton } from './utils.js';
import { initSocket, getSocket } from './socket-client.js';

// Check authentication
const isAuthenticated = requireAuth();
if (!isAuthenticated) {
  console.log('Not authenticated - login to save your journal entries');
}

let currentEditingId = null;
let autoSaveTimeout = null;
let draftId = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Socket.IO if authenticated
  if (isAuthenticated) {
    initSocket();
    
    // Listen for real-time journal updates
    window.addEventListener('journal:created', (e) => {
      showToast('Journal entry saved!', 'success');
      loadJournals();
    });
    
    window.addEventListener('journal:updated', (e) => {
      showToast('Journal entry updated!', 'success');
      loadJournals();
    });
    
    window.addEventListener('journal:deleted', (e) => {
      showToast('Journal entry deleted!', 'success');
      loadJournals();
    });
  }
  
  // Set current date
  const entryDate = document.getElementById('entry-date');
  if (entryDate) {
    entryDate.textContent = formatDate(new Date());
    entryDate.setAttribute('datetime', new Date().toISOString());
  }
  
  // Auto-save functionality
  const journalContent = document.getElementById('journal-content');
  const journalTitle = document.getElementById('journal-title');
  
  if (journalContent) {
    journalContent.addEventListener('input', () => {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        autoSaveJournal();
      }, 2000); // Auto-save after 2 seconds of inactivity
    });
  }
  
  if (journalTitle) {
    journalTitle.addEventListener('input', () => {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        autoSaveJournal();
      }, 2000);
    });
  }
  
  // Form submission
  const journalForm = document.getElementById('journal-form');
  if (journalForm) {
    journalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = journalForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.disabled) return;
      
      const title = journalTitle?.value.trim() || '';
      const content = journalContent?.value.trim() || '';
      
      if (!content) {
        showToast('Please write something in your journal', 'error');
        return;
      }
      
      setButtonLoading(submitBtn, true, currentEditingId ? 'Updating...' : 'Saving...');
      
      try {
        if (currentEditingId) {
          // Update existing entry
          await apiCall(`/journal/${currentEditingId}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content })
          });
          showToast('Journal entry updated successfully!', 'success');
          currentEditingId = null;
          draftId = null;
        } else {
          // Create new entry
          const result = await apiCall('/journal', {
            method: 'POST',
            body: JSON.stringify({ title, content })
          });
          showToast('Journal entry saved successfully!', 'success');
          draftId = result.journal?.id || result.journal?._id || null;
        }
        
        journalForm.reset();
        if (entryDate) {
          entryDate.textContent = formatDate(new Date());
        }
        await loadJournals();
      } catch (error) {
        showToast(error.message || 'Failed to save journal entry', 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }
  
  // Clear button
  const clearBtn = document.getElementById('clear-journal');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear this entry?')) {
        journalForm?.reset();
        currentEditingId = null;
        draftId = null;
        if (entryDate) {
          entryDate.textContent = formatDate(new Date());
        }
      }
    });
  }
  
  // Search functionality
  const searchInput = document.getElementById('journal-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        loadJournals(e.target.value);
      }, 300);
    });
  }
  
  // Clear search button
  const clearSearchBtn = document.getElementById('clear-search-btn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        loadJournals();
      }
    });
  }
  
  // Load journals
  await loadJournals();
});

// Auto-save draft
async function autoSaveJournal() {
  const journalContent = document.getElementById('journal-content');
  const journalTitle = document.getElementById('journal-title');
  
  if (!journalContent || !journalContent.value.trim()) {
    return; // Don't auto-save empty content
  }
  
  try {
    const title = journalTitle?.value.trim() || '';
    const content = journalContent.value.trim();
    
    await apiCall('/journal/autosave', {
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
        draftId
      })
    });
    
    // Show subtle indicator (optional)
    const indicator = document.getElementById('autosave-indicator');
    if (indicator) {
      indicator.textContent = 'Draft saved';
      indicator.classList.remove('hidden');
      setTimeout(() => {
        indicator.classList.add('hidden');
      }, 2000);
    }
  } catch (error) {
    // Silently fail for auto-save
    console.error('Auto-save failed:', error);
  }
}

// Expose refresh function for Socket.IO
window.refreshJournalList = loadJournals;

async function loadJournals(search = '') {
  const container = document.getElementById('journal-entries-list');
  if (!container) return;
  
  // Show loading state
  showSkeleton(container, 'list', 3);
  
  try {
    const endpoint = search ? `/journal?search=${encodeURIComponent(search)}` : '/journal';
    const data = await apiCall(endpoint);
    
      if (!data.journals || data.journals.length === 0) {
        if (search) {
          container.innerHTML = `
            <div class="text-center py-12">
              <div class="text-6xl mb-4">🔍</div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">No entries found</h3>
              <p class="text-gray-600 mb-6">We couldn't find any journal entries matching "${search}". Try a different search term.</p>
              <button onclick="document.getElementById('journal-search').value=''; document.getElementById('journal-search').dispatchEvent(new Event('input'));" class="btn-secondary">
                Clear Search
              </button>
            </div>
          `;
        } else {
          container.innerHTML = `
            <div class="text-center py-12">
              <div class="text-6xl mb-4">📝</div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">No journal entries yet</h3>
              <p class="text-gray-600 mb-6">Your journal is a safe space to express your thoughts and feelings. Start writing your first entry above.</p>
            </div>
          `;
        }
        return;
      }
    
    container.innerHTML = data.journals.map(journal => `
      <article class="card journal-entry" data-id="${journal.id}">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-lg">${journal.title || 'Untitled Entry'}</h3>
          <div class="flex items-center space-x-2">
            <button class="edit-journal text-blue-600 hover:text-blue-700" data-id="${journal.id}">
              ✏️ Edit
            </button>
            <button class="delete-journal text-red-600 hover:text-red-700" data-id="${journal.id}">
              🗑️ Delete
            </button>
          </div>
        </div>
        <p class="text-gray-600 mb-2 whitespace-pre-wrap">${journal.content}</p>
        <time class="text-xs text-gray-500">${formatDateTime(journal.createdAt)}</time>
      </article>
    `).join('');
    
    // Attach event listeners
    attachJournalListeners();
  } catch (error) {
    console.error('Error loading journals:', error);
    const container = document.getElementById('journal-entries-list');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">😕</div>
          <h3 class="text-xl font-semibold text-red-600 mb-2">Unable to load journal entries</h3>
          <p class="text-gray-600 mb-6">${error.message || 'Please check your connection and try again.'}</p>
          <button onclick="location.reload()" class="btn-primary">Retry</button>
        </div>
      `;
    }
    showToast('Failed to load journal entries. Please try again.', 'error');
  }
}

function attachJournalListeners() {
  // Edit buttons
  document.querySelectorAll('.edit-journal').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      btn.disabled = true;
      btn.textContent = 'Loading...';
      
      try {
        const data = await apiCall(`/journal/${id}`);
        const journal = data.journal;
        
        document.getElementById('journal-title').value = journal.title || '';
        document.getElementById('journal-content').value = journal.content || '';
        currentEditingId = id;
        
        // Scroll to form
        document.getElementById('journal-form')?.scrollIntoView({ behavior: 'smooth' });
        showToast('Journal entry loaded for editing', 'info');
      } catch (error) {
        showToast(error.message || 'Failed to load journal entry', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '✏️ Edit';
      }
    });
  });
  
  // Delete buttons
  document.querySelectorAll('.delete-journal').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      showConfirmation({
        title: 'Delete Journal Entry',
        message: 'Are you sure you want to delete this journal entry? This action cannot be undone.',
        type: 'danger',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          setButtonLoading(btn, true, 'Deleting...');
          
          try {
            await apiCall(`/journal/${id}`, { method: 'DELETE' });
            showToast('Journal entry deleted', 'success');
            await loadJournals();
          } catch (error) {
            setButtonLoading(btn, false);
            showToast(error.message || 'Failed to delete journal entry', 'error');
          }
        }
      });
    });
  });
}

// Data Export Feature
import { apiCall, requireAuth, formatDate } from './utils.js';

class DataExport {
  constructor() {
    this.init();
  }

  init() {
    if (!requireAuth()) {
      return;
    }
    this.createExportButtons();
  }

  createExportButtons() {
    const container = document.getElementById('export-container');
    if (!container) return;

    container.innerHTML = `
      <div class="card mb-4">
        <h3 class="text-xl font-semibold mb-4">Export Your Data</h3>
        <p class="text-gray-600 mb-4">Download your data in various formats for your records or to share with healthcare providers.</p>
        
        <div class="space-y-3">
          <button class="btn-primary w-full" id="export-moods-btn">
            📊 Export Mood Data (CSV)
          </button>
          <button class="btn-primary w-full" id="export-journals-btn">
            📝 Export Journals (TXT)
          </button>
          <button class="btn-primary w-full" id="export-goals-btn">
            🎯 Export Goals (JSON)
          </button>
          <button class="btn-primary w-full" id="export-all-btn">
            📦 Export All Data (JSON)
          </button>
        </div>
      </div>
    `;

    document.getElementById('export-moods-btn').addEventListener('click', () => this.exportMoods());
    document.getElementById('export-journals-btn').addEventListener('click', () => this.exportJournals());
    document.getElementById('export-goals-btn').addEventListener('click', () => this.exportGoals());
    document.getElementById('export-all-btn').addEventListener('click', () => this.exportAll());
  }

  async exportMoods() {
    try {
      const data = await apiCall('/mood?limit=1000');
      const csv = this.convertMoodsToCSV(data.moods);
      this.downloadFile(csv, 'mindnest-moods.csv', 'text/csv');
    } catch (error) {
      alert('Failed to export mood data');
    }
  }

  async exportJournals() {
    try {
      const data = await apiCall('/journal?limit=1000');
      const txt = this.convertJournalsToTXT(data.journals);
      this.downloadFile(txt, 'mindnest-journals.txt', 'text/plain');
    } catch (error) {
      alert('Failed to export journals');
    }
  }

  async exportGoals() {
    try {
      const data = await apiCall('/goals');
      const json = JSON.stringify(data.goals, null, 2);
      this.downloadFile(json, 'mindnest-goals.json', 'application/json');
    } catch (error) {
      alert('Failed to export goals');
    }
  }

  async exportAll() {
    try {
      const [moods, journals, goals] = await Promise.all([
        apiCall('/mood?limit=1000'),
        apiCall('/journal?limit=1000'),
        apiCall('/goals')
      ]);

      const allData = {
        exportDate: new Date().toISOString(),
        moods: moods.moods || [],
        journals: journals.journals || [],
        goals: goals.goals || []
      };

      const json = JSON.stringify(allData, null, 2);
      this.downloadFile(json, `mindnest-export-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    } catch (error) {
      alert('Failed to export all data');
    }
  }

  convertMoodsToCSV(moods) {
    const headers = ['Date', 'Mood Level', 'Emotion', 'Note'];
    const rows = moods.map(mood => [
      formatDate(mood.date),
      mood.moodLevel,
      mood.emotion,
      (mood.note || '').replace(/"/g, '""')
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  convertJournalsToTXT(journals) {
    return journals.map(journal => `
${'='.repeat(50)}
Date: ${formatDate(journal.createdAt)}
Title: ${journal.title || 'Untitled'}
${'='.repeat(50)}

${journal.content}

${journal.tags && journal.tags.length > 0 ? `Tags: ${journal.tags.join(', ')}` : ''}

`).join('\n');
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Initialize if export container exists
if (document.getElementById('export-container')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DataExport());
  } else {
    new DataExport();
  }
}



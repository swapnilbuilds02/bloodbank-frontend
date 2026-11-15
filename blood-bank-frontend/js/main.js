/**
 * main.js — Application entry point. Initializes the router, store, and global UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Read and apply settings from localStorage ---
  let settings = {};
  try {
    const raw = localStorage.getItem('bb-settings');
    if (raw) settings = JSON.parse(raw);
  } catch {
    // Corrupted settings — fall back to defaults
  }

  const theme = settings.theme || 'light';
  document.documentElement.setAttribute('data-theme', theme);

  // --- Theme toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);

      // Persist the choice
      try {
        const stored = JSON.parse(localStorage.getItem('bb-settings') || '{}');
        stored.theme = next;
        localStorage.setItem('bb-settings', JSON.stringify(stored));
      } catch {
        localStorage.setItem('bb-settings', JSON.stringify({ theme: next }));
      }
    });
  }

  // --- Placeholder content in #app ---
  const app = document.getElementById('app');
  if (app) {
    const h1 = document.createElement('h1');
    h1.textContent = 'Blood Bank & Donor Management System';

    const p = document.createElement('p');
    p.textContent =
      'Application loading... Core modules will be initialized in subsequent units.';

    app.appendChild(h1);
    app.appendChild(p);
  }

  // --- Search shortcut: '/' focuses quick-search ---
  document.addEventListener('keydown', (e) => {
    if (
      e.key === '/' &&
      !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) &&
      !document.activeElement.isContentEditable
    ) {
      e.preventDefault();
      const searchInput = document.getElementById('quick-search');
      if (searchInput) searchInput.focus();
    }
  });

  console.log('Blood Bank Frontend v1.0 initialized');
});

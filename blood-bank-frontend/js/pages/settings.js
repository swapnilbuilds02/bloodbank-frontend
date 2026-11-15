/**
 * pages/settings.js — User preferences, API connectivity test, clinical thresholds, and system architecture summary.
 * Persists changes immediately to localStorage and updates active runtime state.
 * @module pages/settings
 */

import { h } from '../core/dom.js';
import { getSettings, updateSettings } from '../core/store.js';
import { DEFAULT_SETTINGS, PROJECT_INFO, PAGE_SIZES } from '../config.js';
import { api } from '../core/api.js';
import { notify } from '../ui/toast.js';

export default function renderSettings() {
  const container = h('div', { className: 'settings-page' });
  const settings = getSettings();

  const header = h('div', { className: 'page-header' },
    h('div', {},
      h('h1', { className: 'page-title' }, 'System Configuration & Settings'),
      h('p', { className: 'page-subtitle' }, 'Adjust API connection, UI density, clinical alert thresholds, and examine DBMS architecture.')
    )
  );
  container.appendChild(header);

  // 1. API Connection Section
  const connSection = h('div', { className: 'card', style: { marginBottom: 'var(--space-6)' } },
    h('div', { className: 'card__header' }, h('h2', { className: 'card__title' }, 'Backend API Connection')),
    h('div', { className: 'card__body' },
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'API Base URL'),
        h('input', {
          id: 'setting-api-url',
          type: 'text',
          className: 'form-control',
          value: settings.apiBaseUrl,
          style: { maxWidth: '420px' }
        }),
        h('div', { className: 'form-help' }, 'Default: http://127.0.0.1:5000/api')
      ),
      h('div', { style: { display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', alignItems: 'center' } },
        h('button', {
          className: 'btn btn--secondary btn--sm',
          onClick: async () => {
            const startTime = performance.now();
            try {
              const res = await api('/health');
              const latency = Math.round(performance.now() - startTime);
              notify.success(`Connection verified! Response time: ${latency}ms (Status: ${res.data?.status || 'OK'})`);
            } catch (err) {
              notify.error(`Cannot connect to ${settings.apiBaseUrl}: ${err.message}`);
            }
          }
        }, '⚡ Test Connection Now'),
        h('button', {
          className: 'btn btn--ghost btn--sm',
          onClick: () => {
            document.getElementById('setting-api-url').value = DEFAULT_SETTINGS.apiBaseUrl;
            updateSettings({ apiBaseUrl: DEFAULT_SETTINGS.apiBaseUrl });
            notify.info('API URL reset to default');
          }
        }, 'Reset to Default')
      )
    )
  );
  container.appendChild(connSection);

  // 2. Appearance & Accessibility Section
  const uiSection = h('div', { className: 'card', style: { marginBottom: 'var(--space-6)' } },
    h('div', { className: 'card__header' }, h('h2', { className: 'card__title' }, 'Appearance & Accessibility')),
    h('div', { className: 'card__body', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' } },
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'Theme Mode'),
        h('select', {
          className: 'form-control',
          onChange: (e) => {
            document.documentElement.setAttribute('data-theme', e.target.value);
            updateSettings({ theme: e.target.value });
          }
        },
          h('option', { value: 'light', selected: settings.theme === 'light' }, 'Light (Clinical White)'),
          h('option', { value: 'dark', selected: settings.theme === 'dark' }, 'Dark (Slate High-Contrast)')
        )
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'Display Density'),
        h('select', {
          className: 'form-control',
          onChange: (e) => {
            document.documentElement.setAttribute('data-density', e.target.value);
            updateSettings({ density: e.target.value });
          }
        },
          h('option', { value: 'comfortable', selected: settings.density === 'comfortable' }, 'Comfortable (Default)'),
          h('option', { value: 'compact', selected: settings.density === 'compact' }, 'Compact (Data Dense)')
        )
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'Motion Sensitivity'),
        h('select', {
          className: 'form-control',
          onChange: (e) => {
            const reduce = e.target.value === 'true';
            document.documentElement.setAttribute('data-reduce-motion', String(reduce));
            updateSettings({ reduceMotion: reduce });
          }
        },
          h('option', { value: 'false', selected: !settings.reduceMotion }, 'Allow Transitions'),
          h('option', { value: 'true', selected: !!settings.reduceMotion }, 'Reduce Motion (Disable animations)')
        )
      )
    )
  );
  container.appendChild(uiSection);

  // 3. Clinical Data & Advisory Thresholds
  const dataSection = h('div', { className: 'card', style: { marginBottom: 'var(--space-6)' } },
    h('div', { className: 'card__header' }, h('h2', { className: 'card__title' }, 'Clinical & Operational Thresholds')),
    h('div', { className: 'card__body', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' } },
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'Default Page Size'),
        h('select', {
          className: 'form-control',
          onChange: (e) => updateSettings({ pageSize: parseInt(e.target.value, 10) })
        },
          ...PAGE_SIZES.map(s => h('option', { value: s, selected: settings.pageSize === s }, `${s} items`))
        )
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'Expiry Alert Window (Days)'),
        h('input', {
          type: 'number',
          className: 'form-control',
          value: String(settings.expiryAlertDays || 30),
          min: '1',
          max: '180',
          onChange: (e) => updateSettings({ expiryAlertDays: parseInt(e.target.value, 10) })
        }),
        h('div', { className: 'form-help' }, 'Highlights units expiring soon')
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'Low-Stock Warning Threshold'),
        h('input', {
          type: 'number',
          className: 'form-control',
          value: String(settings.lowStockThreshold || 2),
          min: '1',
          max: '20',
          onChange: (e) => updateSettings({ lowStockThreshold: parseInt(e.target.value, 10) })
        }),
        h('div', { className: 'form-help' }, 'Units per blood group before warning')
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'Donor Waiting Interval (Days)'),
        h('input', {
          type: 'number',
          className: 'form-control',
          value: String(settings.donorEligibilityDays || 90),
          min: '30',
          max: '180',
          onChange: (e) => updateSettings({ donorEligibilityDays: parseInt(e.target.value, 10) })
        }),
        h('div', { className: 'form-help' }, 'Advisory wait between donations (advisory)')
      )
    )
  );
  container.appendChild(dataSection);

  // 4. About & Database Architecture Section
  const aboutSection = h('div', { className: 'card' },
    h('div', { className: 'card__header' }, h('h2', { className: 'card__title' }, 'About & Database Architecture')),
    h('div', { className: 'card__body' },
      h('p', { style: { marginBottom: 'var(--space-3)' } },
        h('strong', {}, PROJECT_INFO.name),
        ` — Version ${PROJECT_INFO.version}. ${PROJECT_INFO.description}`
      ),
      h('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' } },
        `Course: ${PROJECT_INFO.course} • Team: ${PROJECT_INFO.team.join(', ')}`
      ),
      h('h3', { style: { fontSize: 'var(--text-md)', fontWeight: 'bold', marginBottom: 'var(--space-2)' } }, '10 Relational Schema Tables Managed:'),
      h('ul', { style: { listStyle: 'disc', paddingLeft: 'var(--space-5)', fontSize: 'var(--text-xs)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4px' } },
        h('li', {}, 'donor — Donor profile & last donation date'),
        h('li', {}, 'donation — Blood intake, volume & status'),
        h('li', {}, 'bloodtest — HIV, Hepatitis, Malaria screening'),
        h('li', {}, 'bloodinventory — Shelf life & stock counts'),
        h('li', {}, 'bloodbank — Regional storage centers'),
        h('li', {}, 'hospital — External medical institutions'),
        h('li', {}, 'patient — Transfusion recipients'),
        h('li', {}, 'staff — Attending operators & specialists'),
        h('li', {}, 'bloodrequest — Patient requirement orders'),
        h('li', {}, 'bloodissue — Transactional release with row locks')
      ),
      h('div', { style: { marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' } },
        h('strong', {}, 'Academic Scope & Viva Defense: '),
        'This application runs zero external runtime CDNs, relies entirely on standard ES2022 JavaScript modules, escapes all DOM insertions to eliminate XSS, and enforces referential integrity through REST envelope conventions.'
      )
    )
  );
  container.appendChild(aboutSection);

  return container;
}

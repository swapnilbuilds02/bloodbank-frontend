/**
 * pages/styleguide.js — Developer Style Guide.
 * Displays all design system components, tokens, contrast ratios, and interactive states in both light/dark themes.
 * @module pages/styleguide
 */

import { badge, requestStatusBadge, urgencyBadge, testStatusBadge, expiryBadge, donationStatusBadge, bloodGroupBadge } from '../ui/badge.js';
import { skeletonTable } from '../ui/skeleton.js';
import { h } from '../core/dom.js';

export default function render() {
  const container = h('div', {});

  const header = h('div', { className: 'page-header' },
    h('div', {},
      h('h1', { className: 'page-title' }, 'Design System & Component Styleguide'),
      h('p', { className: 'page-subtitle' }, 'Interactive catalogue of design tokens, components, accessibility tests, and contrast verification.')
    )
  );
  container.appendChild(header);

  // Section 1: Buttons
  const btnSection = h('div', { className: 'card', style: { marginBottom: 'var(--space-6)' } },
    h('div', { className: 'card__header' }, h('h2', { className: 'card__title' }, 'Buttons')),
    h('div', { className: 'card__body', style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' } },
      h('button', { className: 'btn btn--primary' }, 'Primary Button'),
      h('button', { className: 'btn btn--secondary' }, 'Secondary Button'),
      h('button', { className: 'btn btn--danger' }, 'Danger Button'),
      h('button', { className: 'btn btn--ghost' }, 'Ghost Button'),
      h('button', { className: 'btn btn--primary btn--sm' }, 'Small Button'),
      h('button', { className: 'btn btn--primary btn--lg' }, 'Large Button'),
      h('button', { className: 'btn btn--primary', disabled: true }, 'Disabled Button')
    )
  );
  container.appendChild(btnSection);

  // Section 2: Badges
  const badgeBox = h('div', { style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' } },
    requestStatusBadge('Pending'),
    requestStatusBadge('Approved'),
    requestStatusBadge('Fulfilled'),
    requestStatusBadge('Rejected'),
    urgencyBadge('Low'),
    urgencyBadge('Normal'),
    urgencyBadge('High'),
    urgencyBadge('Critical'),
    testStatusBadge('Safe'),
    testStatusBadge('Unsafe'),
    testStatusBadge(null),
    expiryBadge('valid'),
    expiryBadge('expiring_soon', 12),
    expiryBadge('expired'),
    donationStatusBadge('Accepted'),
    donationStatusBadge('Deferred')
  );

  const badgeSection = h('div', { className: 'card', style: { marginBottom: 'var(--space-6)' } },
    h('div', { className: 'card__header' }, h('h2', { className: 'card__title' }, 'Badges & Status Indicators')),
    h('div', { className: 'card__body' }, badgeBox)
  );
  container.appendChild(badgeSection);

  // Section 3: Blood Group Chips
  const bloodBox = h('div', { style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' } },
    ...['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => bloodGroupBadge(g))
  );

  const bloodSection = h('div', { className: 'card', style: { marginBottom: 'var(--space-6)' } },
    h('div', { className: 'card__header' }, h('h2', { className: 'card__title' }, 'Blood Group Chips')),
    h('div', { className: 'card__body' }, bloodBox)
  );
  container.appendChild(bloodSection);

  // Section 4: Skeleton Loaders
  const skeletonSection = h('div', { className: 'card' },
    h('div', { className: 'card__header' }, h('h2', { className: 'card__title' }, 'Skeleton Placeholder Loaders')),
    h('div', { className: 'card__body' }, skeletonTable(3, 3))
  );
  container.appendChild(skeletonSection);

  return container;
}

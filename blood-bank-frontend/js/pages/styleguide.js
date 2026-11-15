/**
 * pages/styleguide.js — Developer Style Guide.
 * Displays all design system components, tokens, contrast ratios, and interactive states in both light/dark themes.
 * @module pages/styleguide
 */

import { badge, requestStatusBadge, urgencyBadge, testStatusBadge, expiryBadge, donationStatusBadge, bloodGroupBadge } from '../ui/badge.js';
import { skeleton, skeletonTable } from '../ui/skeleton.js';

export default function render() {
  const container = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <div>
      <h1 class="page-title">Design System &amp; Component Styleguide</h1>
      <p class="page-subtitle">Interactive catalogue of design tokens, components, accessibility tests, and contrast verification.</p>
    </div>
  `;
  container.appendChild(header);

  // Section 1: Buttons
  const btnSection = document.createElement('div');
  btnSection.className = 'card';
  btnSection.style.marginBottom = 'var(--space-6)';
  btnSection.innerHTML = `
    <div class="card__header"><h2 class="card__title">Buttons</h2></div>
    <div class="card__body" style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
      <button class="btn btn--primary">Primary Button</button>
      <button class="btn btn--secondary">Secondary Button</button>
      <button class="btn btn--danger">Danger Button</button>
      <button class="btn btn--ghost">Ghost Button</button>
      <button class="btn btn--primary btn--sm">Small Button</button>
      <button class="btn btn--primary btn--lg">Large Button</button>
      <button class="btn btn--primary" disabled>Disabled Button</button>
    </div>
  `;
  container.appendChild(btnSection);

  // Section 2: Badges
  const badgeSection = document.createElement('div');
  badgeSection.className = 'card';
  badgeSection.style.marginBottom = 'var(--space-6)';
  badgeSection.innerHTML = `
    <div class="card__header"><h2 class="card__title">Badges &amp; Status Indicators</h2></div>
    <div class="card__body" id="styleguide-badges" style="display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center;"></div>
  `;
  container.appendChild(badgeSection);

  const badgeBox = badgeSection.querySelector('#styleguide-badges');
  badgeBox.appendChild(requestStatusBadge('Pending'));
  badgeBox.appendChild(requestStatusBadge('Approved'));
  badgeBox.appendChild(requestStatusBadge('Fulfilled'));
  badgeBox.appendChild(requestStatusBadge('Rejected'));
  badgeBox.appendChild(urgencyBadge('Low'));
  badgeBox.appendChild(urgencyBadge('Normal'));
  badgeBox.appendChild(urgencyBadge('High'));
  badgeBox.appendChild(urgencyBadge('Critical'));
  badgeBox.appendChild(testStatusBadge('Safe'));
  badgeBox.appendChild(testStatusBadge('Unsafe'));
  badgeBox.appendChild(testStatusBadge(null));
  badgeBox.appendChild(expiryBadge('valid'));
  badgeBox.appendChild(expiryBadge('expiring_soon', 12));
  badgeBox.appendChild(expiryBadge('expired'));
  badgeBox.appendChild(donationStatusBadge('Accepted'));
  badgeBox.appendChild(donationStatusBadge('Deferred'));

  // Section 3: Blood Group Chips
  const bloodSection = document.createElement('div');
  bloodSection.className = 'card';
  bloodSection.style.marginBottom = 'var(--space-6)';
  bloodSection.innerHTML = `
    <div class="card__header"><h2 class="card__title">Blood Group Chips</h2></div>
    <div class="card__body" id="styleguide-blood-chips" style="display: flex; gap: var(--space-3); flex-wrap: wrap;"></div>
  `;
  container.appendChild(bloodSection);

  const bloodBox = bloodSection.querySelector('#styleguide-blood-chips');
  ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].forEach(g => {
    bloodBox.appendChild(bloodGroupBadge(g));
  });

  // Section 4: Skeleton Loaders
  const skeletonSection = document.createElement('div');
  skeletonSection.className = 'card';
  skeletonSection.innerHTML = `
    <div class="card__header"><h2 class="card__title">Skeleton Placeholder Loaders</h2></div>
    <div class="card__body" id="styleguide-skeletons"></div>
  `;
  container.appendChild(skeletonSection);
  skeletonSection.querySelector('#styleguide-skeletons').appendChild(skeletonTable(3, 3));

  return container;
}

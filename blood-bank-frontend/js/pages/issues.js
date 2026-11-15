/**
 * pages/issues.js — Blood issue history log and slip re-printing.
 * Issues are irreversible database transactions: editing quantity or deleting is disabled by design.
 * @module pages/issues
 */

import { h } from '../core/dom.js';
import { dataTable } from '../ui/table.js';
import { openDrawer } from '../ui/drawer.js';
import { bloodGroupBadge } from '../ui/badge.js';
import { formatDate, pluralize } from '../core/format.js';
import issuesService from '../services/issues.js';

export default function renderIssues(params, query) {
  const container = h('div', { className: 'issues-page' });

  const header = h('div', { className: 'page-header' },
    h('div', {},
      h('h1', { className: 'page-title' }, 'Blood Issue History'),
      h('p', { className: 'page-subtitle' }, 'Permanent audit log of blood units released to hospital requests.')
    )
  );
  container.appendChild(header);

  const table = dataTable({
    columns: [
      { key: 'issue_id', label: 'Issue #' },
      {
        key: 'issue_date',
        label: 'Date',
        render: (d) => formatDate(d)
      },
      {
        key: 'units_issued',
        label: 'Units',
        render: (u) => h('span', { style: { fontWeight: 'bold' } }, pluralize(u, 'unit'))
      },
      {
        key: 'patient_name',
        label: 'Patient',
        render: (p, row) => p || `Patient (Req #${row.request_id})`
      },
      {
        key: 'hospital_name',
        label: 'Hospital',
        render: (hName) => hName || 'Hospital'
      },
      {
        key: 'blood_group',
        label: 'Group',
        render: (g) => bloodGroupBadge(g)
      },
      {
        key: 'inventory_id',
        label: 'Stock ID',
        render: (invId) => `#${invId}`
      },
      {
        key: 'staff_name',
        label: 'Issued By',
        render: (s) => s || 'Staff'
      }
    ],
    fetchPage: (p, signal) => issuesService.history(p, signal),
    rowActions: [
      {
        label: 'Slip',
        onClick: (row) => openSlipDrawer(row)
      }
    ],
    exportName: 'blood_issues_log',
    onRowClick: (row) => openSlipDrawer(row)
  });

  container.appendChild(table);
  return container;
}

function openSlipDrawer(row) {
  const content = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } },
    h('div', { className: 'issue-slip', style: { border: '1px solid var(--color-border)', margin: 0 } },
      h('div', { className: 'issue-slip__title', style: { fontSize: 'var(--text-lg)' } }, 'BLOOD ISSUE RECEIPT'),
      h('div', { className: 'issue-slip__row' }, h('span', {}, 'Issue ID:'), h('span', { style: { fontWeight: 'bold' } }, `#${row.issue_id}`)),
      h('div', { className: 'issue-slip__row' }, h('span', {}, 'Date:'), h('span', {}, formatDate(row.issue_date))),
      h('div', { className: 'issue-slip__row' }, h('span', {}, 'Hospital:'), h('span', {}, row.hospital_name || 'Hospital')),
      h('div', { className: 'issue-slip__row' }, h('span', {}, 'Patient:'), h('span', {}, row.patient_name || `Patient #${row.patient_id}`)),
      h('div', { className: 'issue-slip__row' }, h('span', {}, 'Blood Group:'), bloodGroupBadge(row.blood_group)),
      h('div', { className: 'issue-slip__row' }, h('span', {}, 'Quantity:'), h('span', { style: { fontWeight: 'bold' } }, pluralize(row.units_issued, 'unit'))),
      h('div', { className: 'issue-slip__row' }, h('span', {}, 'Stock Inventory:'), h('span', {}, `#${row.inventory_id}`)),
      h('div', { className: 'issue-slip__row' }, h('span', {}, 'Issuing Staff:'), h('span', {}, row.staff_name || `Staff #${row.staff_id}`)),
      h('div', { className: 'issue-slip__disclaimer', style: { marginTop: 'var(--space-4)' } },
        'Academic project — not for clinical use.'
      )
    ),
    h('button', {
      className: 'btn btn--primary',
      onClick: () => window.print()
    }, '🖨 Print Issue Slip')
  );

  openDrawer({
    title: `Issue #${row.issue_id} Receipt`,
    content
  });
}

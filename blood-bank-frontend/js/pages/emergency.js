/**
 * pages/emergency.js — Rapid Emergency Response Triage: Find Blood & Find Donors in under 10 seconds.
 * Aggregates live unexpired inventory by bank with direct tel/mailto links and donor dispatch.
 * @module pages/emergency
 */

import { h } from '../core/dom.js';
import { api } from '../core/api.js';
import { bloodGroupBadge } from '../ui/badge.js';
import { formatDate, formatRelativeDays, daysFromToday, getInitials } from '../core/format.js';
import { notify } from '../ui/toast.js';
import { getSetting } from '../core/store.js';
import lookupsService from '../services/lookups.js';
import { BLOOD_GROUPS } from '../config.js';
import { navigate } from '../core/router.js';

export default function renderEmergency(params, query) {
  const container = h('div', { className: 'emergency-page' });

  const header = h('div', { className: 'page-header' },
    h('div', {},
      h('h1', { className: 'page-title', style: { color: 'var(--color-danger)' } }, '🚨 Emergency Blood & Donor Finder'),
      h('p', { className: 'page-subtitle' }, 'Rapidly identify available verified units across all regional blood banks and dispatch eligible on-call donors.')
    )
  );
  container.appendChild(header);

  // Disclaimer banner
  const disclaimer = h('div', { className: 'alert alert--warning', style: { marginBottom: 'var(--space-6)' } },
    h('span', { style: { fontWeight: 'bold' } }, 'Transfusion Rule Notice:'),
    h('span', {}, 'This system enforces exact blood-group matches for issuances. Compatibility rules (e.g. O- negative as universal red cell donor) are provided below for clinical information only.')
  );
  container.appendChild(disclaimer);

  // Tab Selection
  const activeTab = (query && query.get('tab')) || 'blood';
  const selectedGroup = (query && query.get('group')) || 'O-';

  const tabs = h('div', { className: 'tabs' },
    h('div', {
      className: `tab ${activeTab === 'blood' ? 'active' : ''}`,
      onClick: () => navigate(`/emergency?tab=blood&group=${encodeURIComponent(selectedGroup)}`)
    }, 'Find Available Blood Stock'),
    h('div', {
      className: `tab ${activeTab === 'donors' ? 'active' : ''}`,
      onClick: () => navigate(`/emergency?tab=donors&group=${encodeURIComponent(selectedGroup)}`)
    }, 'Find On-Call Donors')
  );
  container.appendChild(tabs);

  // Blood Group Selector Chips
  const chipContainer = h('div', { style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)', alignItems: 'center' } },
    h('span', { style: { fontWeight: 'bold', fontSize: 'var(--text-sm)', marginRight: 'var(--space-2)' } }, 'Required Blood Group:')
  );

  BLOOD_GROUPS.forEach(g => {
    const isSelected = g === selectedGroup;
    const btn = h('button', {
      className: `btn ${isSelected ? 'btn--primary' : 'btn--secondary'} btn--sm`,
      style: isSelected ? { fontWeight: 'bold', transform: 'scale(1.05)' } : {},
      onClick: () => navigate(`/emergency?tab=${activeTab}&group=${encodeURIComponent(g)}`)
    }, g);
    chipContainer.appendChild(btn);
  });
  container.appendChild(chipContainer);

  // Content Mount Point
  const mount = h('div', {});
  container.appendChild(mount);

  if (activeTab === 'blood') {
    renderFindBlood(mount, selectedGroup);
  } else {
    renderFindDonors(mount, selectedGroup);
  }

  return container;
}

async function renderFindBlood(mount, bloodGroup) {
  mount.replaceChildren(h('div', { style: { textAlign: 'center', padding: 'var(--space-8)' } }, `Searching regional inventory for ${bloodGroup} units...`));

  try {
    const [invRes, banks] = await Promise.all([
      api('/inventory', { query: { blood_group: encodeURIComponent(bloodGroup), limit: 200 } }),
      lookupsService.getBloodBanks()
    ]);

    const bankMap = new Map();
    banks.forEach(b => bankMap.set(b.bank_id, b));

    // Keep ONLY valid, safe, and positive available units
    const issuable = (invRes.data || []).filter(item => {
      const notExpired = item.expiry_status === 'valid' || item.expiry_status === 'expiring_soon';
      const isSafe = item.test_status === 'Safe';
      return notExpired && isSafe && item.units_available > 0;
    });

    mount.innerHTML = '';

    // Compatibility advice note
    const adviceBox = h('div', {
      className: 'card',
      style: {
        padding: 'var(--space-3) var(--space-4)',
        marginBottom: 'var(--space-4)',
        backgroundColor: 'var(--color-bg-secondary)',
        fontSize: 'var(--text-xs)'
      }
    },
      h('span', { style: { fontWeight: 'bold' } }, 'Clinical Compatibility Hint (Informational Only): '),
      bloodGroup === 'O-'
        ? 'O- is the universal red-cell donor type and can be given to all ABO/Rh groups in severe crises.'
        : bloodGroup === 'AB+'
          ? 'AB+ is the universal red-cell recipient and can accept red blood cells from any blood type.'
          : `${bloodGroup} patients can typically receive ${bloodGroup} and O- red cells in emergencies.`
    );
    mount.appendChild(adviceBox);

    if (issuable.length === 0) {
      mount.appendChild(h('div', { className: 'empty-state' },
        h('h3', { className: 'empty-state__title', style: { color: 'var(--color-danger)' } }, `Zero Usable ${bloodGroup} Stock Available`),
        h('p', { className: 'empty-state__description' }, 'No tested, safe, unexpired units of this group exist in any connected blood bank.'),
        h('button', {
          className: 'btn btn--primary',
          onClick: () => navigate(`/emergency?tab=donors&group=${encodeURIComponent(bloodGroup)}`)
        }, `Find On-Call ${bloodGroup} Donors Immediately →`)
      ));
      return;
    }

    // Group inventory units by blood bank
    const byBank = new Map();
    issuable.forEach(item => {
      if (!byBank.has(item.bank_id)) {
        const bankInfo = bankMap.get(item.bank_id) || {};
        byBank.set(item.bank_id, {
          bank_id: item.bank_id,
          bank_name: item.bank_name || bankInfo.bank_name || `Bank #${item.bank_id}`,
          city: bankInfo.city || 'City',
          phone: bankInfo.contact_number || '',
          email: bankInfo.email || '',
          total_units: 0,
          soonest_expiry: item.expiry_date
        });
      }
      const bObj = byBank.get(item.bank_id);
      bObj.total_units += item.units_available;
      if (new Date(item.expiry_date) < new Date(bObj.soonest_expiry)) {
        bObj.soonest_expiry = item.expiry_date;
      }
    });

    const bankList = Array.from(byBank.values()).sort((a, b) => b.total_units - a.total_units);

    const listEl = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } });
    bankList.forEach(b => {
      const card = h('div', {
        className: 'card',
        style: {
          padding: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          borderLeft: '4px solid var(--color-success)'
        }
      },
        h('div', {},
          h('h3', { style: { fontSize: 'var(--text-lg)', fontWeight: 'bold' } }, b.bank_name),
          h('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' } },
            `Location: ${b.city} • Soonest Expiry: ${formatDate(b.soonest_expiry)} (${formatRelativeDays(b.soonest_expiry)})`
          ),
          h('div', { style: { display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' } },
            b.phone ? h('a', { href: `tel:${b.phone}`, className: 'btn btn--secondary btn--sm' }, `📞 Call: ${b.phone}`) : null,
            b.email ? h('a', { href: `mailto:${b.email}`, className: 'btn btn--ghost btn--sm' }, `✉ Email`) : null
          )
        ),
        h('div', { style: { textAlign: 'right' } },
          h('div', { style: { fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-success)' } },
            `${b.total_units} unit(s)`
          ),
          h('span', { className: 'badge badge--success' }, 'Ready for Issue')
        )
      );
      listEl.appendChild(card);
    });

    mount.appendChild(listEl);
  } catch (err) {
    mount.replaceChildren(h('div', { className: 'empty-state' },
      h('h3', {}, 'Emergency Search Failed'),
      h('p', {}, err.message)
    ));
  }
}

async function renderFindDonors(mount, bloodGroup) {
  mount.replaceChildren(h('div', { style: { textAlign: 'center', padding: 'var(--space-8)' } }, `Finding on-call ${bloodGroup} donors...`));

  try {
    const res = await api('/donors', { query: { blood_group: encodeURIComponent(bloodGroup), limit: 100 } });
    const donors = res.data || [];
    const eligibilityDays = getSetting('donorEligibilityDays') || 90;

    mount.innerHTML = '';

    if (donors.length === 0) {
      mount.appendChild(h('div', { className: 'empty-state' },
        h('h3', { className: 'empty-state__title' }, `No ${bloodGroup} Donors Registered`),
        h('p', { className: 'empty-state__description' }, 'Consider registering new community volunteers.'),
        h('button', { className: 'btn btn--primary', onClick: () => navigate('/donors') }, '+ Register Donor')
      ));
      return;
    }

    // Sort: Eligible first, then longest time since last donation
    const sorted = [...donors].sort((a, b) => {
      const daysA = a.last_donation_date ? Math.abs(daysFromToday(a.last_donation_date) || 0) : 9999;
      const daysB = b.last_donation_date ? Math.abs(daysFromToday(b.last_donation_date) || 0) : 9999;
      return daysB - daysA;
    });

    const listEl = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } });
    sorted.forEach(d => {
      const daysSince = d.last_donation_date ? Math.abs(daysFromToday(d.last_donation_date) || 0) : null;
      const isEligible = daysSince === null || daysSince >= eligibilityDays;

      const card = h('div', {
        className: 'card',
        style: {
          padding: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }
      },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } },
          h('div', { className: 'avatar' }, getInitials(d.donor_name)),
          h('div', {},
            h('div', { style: { fontWeight: 'bold' } }, d.donor_name),
            h('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' } },
              `${d.city || 'City'} • Last Donated: ${d.last_donation_date ? formatDate(d.last_donation_date) : 'Never (First time)'}`
            )
          )
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } },
          isEligible
            ? h('span', { className: 'badge badge--success' }, 'Eligible to Donate')
            : h('span', { className: 'badge badge--warning' }, `Eligible in ${eligibilityDays - daysSince}d`),
          d.phone ? h('a', { href: `tel:${d.phone}`, className: 'btn btn--primary btn--sm' }, `📞 Call ${d.phone}`) : null,
          d.phone ? h('button', {
            className: 'btn btn--secondary btn--sm',
            onClick: () => {
              navigator.clipboard?.writeText(d.phone);
              notify.success(`Phone copied: ${d.phone}`);
            }
          }, 'Copy') : null
        )
      );
      listEl.appendChild(card);
    });

    mount.appendChild(listEl);
  } catch (err) {
    mount.replaceChildren(h('div', { className: 'empty-state' },
      h('h3', {}, 'Failed to retrieve donors'),
      h('p', {}, err.message)
    ));
  }
}

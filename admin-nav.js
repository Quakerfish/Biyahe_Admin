// Shared by every logged-in admin page. Loads the current admin, shows the
// real role in the top bar, and adds an "Accounts" link to the sidebar for
// superadmins only. Requires api-config.js (API_BASE) to be loaded first.
(function () {
  const KEY = 'biyahe_admin_role';

  function addAccountsLink() {
    const nav = document.querySelector('.side-nav');
    if (!nav || nav.querySelector('[data-accounts-link]')) return;
    const link = document.createElement('a');
    link.href = 'accounts.html';
    link.className = 'side-link' + (location.pathname.endsWith('accounts.html') ? ' is-active' : '');
    link.setAttribute('data-accounts-link', '');
    link.innerHTML = '<span class="side-icon"></span>Accounts';
    const settings = nav.querySelector('a[href="settings.html"]');
    nav.insertBefore(link, settings || null);
  }

  function applyRole(role) {
    const chip = document.querySelector('.admin-role');
    if (chip) chip.textContent = (role || 'admin').toUpperCase();
    if (role === 'superadmin') addAccountsLink();
  }

  // Use the last known role immediately so the link doesn't pop in late.
  try { applyRole(sessionStorage.getItem(KEY)); } catch (e) {}

  document.addEventListener('DOMContentLoaded', async function () {
    try { applyRole(sessionStorage.getItem(KEY)); } catch (e) {}
    try {
      const res = await fetch(`${API_BASE}/api/admin/profile`, { credentials: 'include' });
      if (!res.ok) return; // each page already handles 401 itself
      const data = await res.json();
      if (data.success && data.admin) {
        try { sessionStorage.setItem(KEY, data.admin.role); } catch (e) {}
        applyRole(data.admin.role);
      }
    } catch (e) { /* offline: leave the nav as is */ }
  });
})();
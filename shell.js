/* ============================================================
   BIYAHE Admin - shared shell.
   Load in <head> AFTER api-config.js (needs API_BASE).
   - applies the saved theme immediately (no flash)
   - exposes window.Biyahe helpers (api, toast, csv export, ...)
   - on DOMContentLoaded, fills #sidebarMount and #topbarMount
   - Biyahe.ready resolves with the logged-in admin (or redirects to login)
   ============================================================ */
(function () {
  'use strict';

  try { document.documentElement.setAttribute('data-theme', localStorage.getItem('biyahe-theme') || 'light'); } catch (e) {}

  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    route: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V7"/><path d="M12 13v4"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    ban: '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>',
    bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'
  };

  function icon(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function showToast(message, type) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'toast-item' + (type ? ' ' + type : '');
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(40px)';
      setTimeout(() => t.remove(), 350);
    }, 3200);
  }

  // JSON fetch that sends the session cookie, redirects to login on 401,
  // and throws Error(message) for any non-OK / success:false response.
  // ---------- loading indicators ----------
  let inflight = 0, idleTimer = null, barEl = null;
  function bar() {
    if (!barEl) { barEl = document.createElement('div'); barEl.className = 'load-bar'; barEl.setAttribute('role', 'progressbar'); barEl.setAttribute('aria-label', 'Loading'); (document.body || document.documentElement).appendChild(barEl); }
    return barEl;
  }
  function busyStart() { inflight++; clearTimeout(idleTimer); try { bar().classList.add('on'); } catch (e) {} }
  function busyEnd() {
    inflight = Math.max(0, inflight - 1);
    if (inflight === 0) {
      idleTimer = setTimeout(function () {
        if (inflight !== 0) return;
        if (barEl) barEl.classList.remove('on');
        settleSkeletons();
      }, 250);
    }
  }
  // Anything still showing a skeleton once all requests finished = load failed or the value was never written.
  function settleSkeletons() {
    document.querySelectorAll('[data-skel].sk').forEach(function (el) { el.classList.remove('sk'); });
    document.querySelectorAll('.sk-wrap').forEach(function (w) {
      const p = w.parentElement;
      w.remove();
      if (p && !p.children.length && !p.textContent.trim()) p.innerHTML = '<p class="empty-note" style="text-align:center;color:var(--text-muted);padding:16px 0;font-size:13px;">Could not load data. Please refresh.</p>';
    });
  }
  // Text/number placeholders: shimmer until the page writes into them.
  function initSkeletons() {
    const obs = new MutationObserver(function (list) {
      list.forEach(function (m) { const el = m.target.nodeType === 3 ? m.target.parentElement : m.target; if (el && el.classList) el.classList.remove('sk'); });
    });
    document.querySelectorAll('[data-skel]').forEach(function (el) {
      el.classList.add('sk');
      obs.observe(el, { childList: true, characterData: true, subtree: true });
    });
  }
  // Disable + spin a button while an async action runs.
  async function withBusy(btn, fn) {
    if (btn) btn.classList.add('is-busy');
    try { return await fn(); } finally { if (btn) btn.classList.remove('is-busy'); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSkeletons); else initSkeletons();

  async function api(path, opts) {
    busyStart();
    try { return await apiInner(path, opts); } finally { busyEnd(); }
  }
  async function apiInner(path, opts) {
    const options = Object.assign({ credentials: 'include' }, opts || {});
    if (options.body && !(options.body instanceof FormData)) {
      options.headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
      if (typeof options.body !== 'string') options.body = JSON.stringify(options.body);
    }
    const res = await fetch(API_BASE + path, options);
    if (res.status === 401 && !path.startsWith('/api/admin/login')) {
      try { sessionStorage.removeItem('biyahe_admin_role'); } catch (e) {}
      window.location.href = 'index.html';
      throw new Error('Session expired.');
    }
    const raw = await res.text();
    let body = null;
    try { body = JSON.parse(raw); } catch (e) { throw new Error('Server returned a non-JSON response (status ' + res.status + ').'); }
    if (!res.ok || (body && body.success === false)) {
      throw new Error((body && (body.message || body.detail)) || 'Request failed (status ' + res.status + ').');
    }
    return body;
  }

  // ---------- CSV export ----------
  function csvCell(v) {
    if (v == null) return '';
    let s = typeof v === 'number' ? String(v) : String(v);
    // Neutralise spreadsheet formula injection for text cells.
    if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
    if (/[",\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  // columns: [{ header: 'Route Code', value: row => row.route_code }, ...]
  function toCsv(rows, columns) {
    const lines = [columns.map(c => csvCell(c.header)).join(',')];
    rows.forEach(r => lines.push(columns.map(c => csvCell(c.value(r))).join(',')));
    return lines.join('\r\n');
  }
  function downloadText(filename, text) {
    // BOM so Excel opens UTF-8 (peso sign, Filipino names) correctly.
    const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function stamp() { return new Date().toISOString().slice(0, 10); }
  function exportCsv(baseName, rows, columns) {
    if (!rows || rows.length === 0) { showToast('Nothing to export yet.', 'error'); return; }
    downloadText('biyahe-' + baseName + '-' + stamp() + '.csv', toCsv(rows, columns));
    showToast('Exported ' + rows.length + ' row' + (rows.length === 1 ? '' : 's') + ' to CSV.', 'success');
  }

  function initials(name) {
    const parts = String(name || '?').replace(/[^A-Za-z0-9 _.-]/g, '').split(/[ _.-]+/).filter(Boolean);
    if (parts.length === 0) return '?';
    return ((parts[0][0] || '') + (parts.length > 1 ? parts[1][0] : (parts[0][1] || ''))).toUpperCase();
  }
  const peso = n => (n == null || n === '') ? '-' : '₱' + Number(n).toFixed(2);
  const roleLabel = r => r === 'superadmin' ? 'Super Admin' : 'Admin';

  async function logout() {
    try { await fetch(API_BASE + '/api/logout', { method: 'POST', credentials: 'include' }); } catch (e) {}
    try { sessionStorage.removeItem('biyahe_admin_role'); } catch (e) {}
    window.location.href = 'index.html';
  }

  const B = window.Biyahe = { withBusy: withBusy,
    icon, escapeHtml, showToast, api, exportCsv, toCsv, initials, peso, roleLabel, logout,
    me: null, ready: null
  };

  // ---------- shell rendering ----------
  const NAV = [
    { key: 'dashboard', href: 'dashboard.html', label: 'Dashboard', icon: 'grid' },
    { key: 'analytics', href: 'analytics.html', label: 'Analytics', icon: 'chart' },
    { key: 'routes', href: 'routes.html', label: 'Routes', icon: 'route' },
    { key: 'terminals', href: 'terminals.html', label: 'Terminals', icon: 'building' },
    { key: 'ratings', href: 'ratings.html', label: 'Ratings', icon: 'star' },
    { key: 'users', href: 'accounts.html', label: 'User Management', icon: 'users', superOnly: true },
    { key: 'settings', href: 'settings.html', label: 'Settings', icon: 'sliders' }
  ];
  const LOGO = '<svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" fill="#dc2626"/><circle cx="12" cy="10" r="3" fill="#1d4ed8"/></svg>';

  function renderSidebar(role) {
    const mount = document.getElementById('sidebarMount');
    if (!mount) return;
    const active = document.body.dataset.page;
    const items = NAV.filter(n => !n.superOnly || role === 'superadmin').map(n =>
      '<a class="nav-link' + (n.key === active ? ' is-active' : '') + '" href="' + n.href + '">' + icon(n.icon) + '<span>' + n.label + '</span></a>'
    ).join('');
    mount.className = 'sidebar';
    mount.innerHTML =
      '<div class="brand"><div class="brand-logo">' + LOGO + '</div><div><div class="brand-name">BIYAHE</div><div class="brand-sub">CIVIC TRANSIT PORTAL</div></div></div>' +
      '<div class="nav-label">OPERATIONS CORE</div>' +
      '<nav class="side-nav">' + items + '</nav>' +
      '<button class="nav-signout" id="signOutBtn" type="button">' + icon('logout') + '<span>Sign Out</span></button>';
    document.getElementById('signOutBtn').addEventListener('click', logout);
  }

  function renderTopbar(admin) {
    const mount = document.getElementById('topbarMount');
    if (!mount) return;
    const name = (admin && admin.username) ? admin.username : 'Administrator';
    const role = admin ? admin.role : '';
    mount.className = 'topbar';
    mount.innerHTML =
      '<div class="topbar-pin">' + icon('pin', 'sm') + '</div>' +
      '<div class="topbar-welcome">Welcome, <strong id="topbarWelcomeName">' + escapeHtml(name) + '</strong></div>' +
      '<span class="chip"><span class="dot"></span>Cebu Route Network</span>' +
      '<div class="topbar-right">' +
        (role === 'superadmin'
          ? '<a class="icon-btn" id="bellBtn" href="accounts.html" title="Admin accounts waiting for approval">' + icon('bell') + '<span class="bell-dot" id="bellDot"></span></a>'
          : '') +
        '<a class="admin-chip" href="settings.html"><div class="admin-meta"><div class="admin-name" id="topbarAdminName">' + escapeHtml(name) + '</div><div class="admin-role" id="topbarAdminRole">' + (role ? roleLabel(role) : '') + '</div></div>' +
        '<div class="avatar-circle" id="topbarAvatar">' + escapeHtml(initials(name)) + '</div></a>' +
      '</div>';
  }

  async function updateBell() {
    const dot = document.getElementById('bellDot');
    if (!dot) return;
    try {
      const [pend, resets] = await Promise.all([
        api('/api/admin/admins/pending'),
        api('/api/admin/admins/password-requests').catch(function () { return { admins: [] }; })
      ]);
      const a = (pend.admins || []).length, r = (resets.admins || []).length, n = a + r;
      dot.classList.toggle('show', n > 0);
      const bell = document.getElementById('bellBtn');
      if (bell) {
        const parts = [];
        if (a) parts.push(a + ' account' + (a === 1 ? '' : 's') + ' waiting for approval');
        if (r) parts.push(r + ' password reset request' + (r === 1 ? '' : 's'));
        bell.title = parts.length ? parts.join(', ') : 'Nothing waiting for approval';
      }
    } catch (e) { /* non-critical */ }
  }

  // Render immediately from the cached role so the sidebar doesn't jump.
  let cachedRole = '';
  try { cachedRole = sessionStorage.getItem('biyahe_admin_role') || ''; } catch (e) {}

  B.ready = new Promise(function (resolve) {
    function start() {
      renderSidebar(cachedRole);
      renderTopbar(cachedRole ? { username: '', role: cachedRole } : null);
      api('/api/admin/profile').then(function (data) {
        B.me = data.admin;
        try { sessionStorage.setItem('biyahe_admin_role', data.admin.role); } catch (e) {}
        renderSidebar(data.admin.role);
        renderTopbar(data.admin);
        updateBell();
        resolve(data.admin);
      }).catch(function () { /* api() already redirected on 401 */ });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  });
})();
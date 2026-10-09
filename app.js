// Icons: `logo` sits on a white tile, `image` fills the tile, `glyph` draws a symbol on a `theme` gradient.
const APPS = [
  { id: 'tally', name: 'Tally', desc: 'Shared shopping lists and to-dos', image: 'tally.svg', web: { url: 'https://tally.jrapp.co.uk' } },
  { id: 'audiobookshelf', name: 'Audiobookshelf', logo: 'audiobookshelf.svg', theme: ['#f59e0b', '#c2410c'], home: { url: 'http://192.168.0.35:13378', desc: 'Use this for uploads over 100 MB' }, web: { url: 'https://audiobooks.jrapp.co.uk', desc: 'Listen from anywhere' } },
  { id: 'jellyfin', name: 'Jellyfin', desc: 'Films and TV library', logo: 'jellyfin.svg', theme: ['#7b4dff', '#2fa6ff'], home: { url: 'http://192.168.0.35:8096' } },
  { id: 'pihole', name: 'Pi-hole', desc: 'DNS and network controls', logo: 'pi-hole.svg', home: { url: 'http://192.168.0.35/admin' } },
  { id: 'beszel', name: 'Beszel', desc: 'Server health and metrics', logo: 'beszel.svg', home: { url: 'http://192.168.0.35:8090' } },
  { id: 'bridge-invite', name: 'Bridge House Invite', desc: 'RSVP and food voting', image: 'bridge-house.svg', web: { url: 'https://bridgehouseinvite.siplyapp.co.uk' } },
  { id: 'portainer', name: 'Portainer', desc: 'Manage Docker containers', logo: 'portainer.svg', home: { url: 'https://192.168.0.35:9443', check: false }, web: { url: 'https://portainer.jrapp.co.uk' } },
  { id: 'cloudflare', name: 'Cloudflare', desc: 'Manage your Cloudflare account', logo: 'cloudflare.svg', home: { url: 'https://dash.cloudflare.com/579bd1d79bb2eab5ff06e1479b504af9/home', check: false }, web: { url: 'https://dash.cloudflare.com/579bd1d79bb2eab5ff06e1479b504af9/home', check: false } },
  { id: 'tutoring', name: 'Tutoring website', desc: 'Jason Rafferty Tutoring', glyph: 'cap', theme: ['#818cf8', '#6d28d9'], web: { url: 'https://jasonrafferty.github.io' } },
  { id: 'student-arcade', name: 'Student Game Arcade', desc: 'Games made by your students', glyph: 'gamepad', theme: ['#4ade80', '#0891b2'], web: { url: 'https://jasonrafferty.github.io/student-game-arcade/' } },
  { id: 'siply-site', name: 'Siply website', desc: 'Marketing site', image: 'siply.svg', web: { url: 'https://siplyapp.co.uk' } },
];

const SIPLY = ['#2a2a2a', '#111111', '#dfff2f'];

// Folders keep related links out of the main drawer, much like an iPhone home-screen folder.
const FOLDERS = [
  { id: 'siply-environments', name: 'Siply environments', desc: 'Dev, UAT and admin tools', mode: 'web', children: [
    { name: 'Siply Dev', url: 'https://dev.siplyapp.co.uk', image: 'siply-app.svg', badge: 'DEV' },
    { name: 'Siply UAT', url: 'https://uat.siplyapp.co.uk', image: 'siply-app.svg', badge: 'UAT' },
    { name: 'Siply Dev Admin', url: 'https://dev-admin.siplyapp.co.uk', glyph: 'shield', theme: SIPLY, badge: 'DEV' },
    { name: 'Siply UAT Admin', url: 'https://uat-admin.siplyapp.co.uk', glyph: 'shield', theme: SIPLY, badge: 'UAT' },
  ] },
  { id: 'projects', name: 'Projects', desc: 'Games, tools and source code', mode: 'web', children: [
    { name: 'Blackjack Game', url: 'https://jasonrafferty.github.io/blackjack-game/', logo: 'blackjack.png' },
    { name: 'Traffic Notifier', url: 'https://jasonrafferty.github.io/traffic-notifier/', glyph: 'cone', theme: ['#60a5fa', '#1d4ed8'] },
    { name: 'Take-Home Calculator', url: 'https://jasonrafferty.github.io/take-home-calculator/', glyph: 'calculator', theme: ['#4ade80', '#15803d'] },
    { name: 'Bridge House site', url: 'https://bridgehouseinvite.siplyapp.co.uk/', image: 'bridge-house.svg' },
  ] },
];

// Simple line symbols for sites without their own icon (24 × 24, drawn with the current colour).
const GLYPHS = {
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2.2 9 2.2 12 0v-5"/>',
  gamepad: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 12.5h4M9 10.5v4"/><path d="M15.5 11h.01M17.5 14h.01"/>',
  cone: '<path d="M9.5 3h5l4.5 17h-14Z"/><path d="M7.8 11h8.4M6.6 15.5h10.8M3 20h18"/>',
  calculator: '<rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M8.5 6.5h7"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
};

const MODES = {
  home: { note: 'opens on your home Wi-Fi', away: 'Not reachable. Are you on your home Wi-Fi?' },
  web: { note: 'works from anywhere', away: 'Nothing reachable. Check your connection.' },
};
const ICON_DIR = 'assets/icons/';
const CHECK_TIMEOUT_MS = 4000;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

const $ = (selector) => document.querySelector(selector);
const grid = $('#grid');
const dialog = $('#folder-dialog');
const status = new Map(); // `${mode}:${id}` for apps, `${mode}:${folderId}:${index}` for folder links
let mode = readMode();
let layout = readLayout();
let editing = false;
let openFolderId = null;
document.body.classList.add('preload');

function readMode() { try { return localStorage.getItem('app-drawer-mode') === 'home' ? 'home' : 'web'; } catch { return 'web'; } }
function readLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem('app-drawer-layout') || '{}');
    return Object.fromEntries(['home', 'web'].map((key) => [key, {
      order: Array.isArray(saved?.[key]?.order) ? saved[key].order.filter((id) => typeof id === 'string') : [],
      hidden: Array.isArray(saved?.[key]?.hidden) ? saved[key].hidden.filter((id) => typeof id === 'string') : [],
    }]));
  } catch { return { home: { order: [], hidden: [] }, web: { order: [], hidden: [] } }; }
}
function saveLayout() {
  try { localStorage.setItem('app-drawer-layout', JSON.stringify(layout)); }
  catch { showToast('Changes could not be saved in this browser'); }
}
function appsFor(activeMode) { return APPS.filter((app) => app[activeMode]); }
// Links marked `check: false` can't be checked from the browser (self-signed certificate, or the site blocks it).
function checkedApps(activeMode) { return appsFor(activeMode).filter((app) => app[activeMode].check !== false); }
function foldersFor(activeMode) { return FOLDERS.filter((folder) => folder.mode === activeMode); }
function itemsFor(activeMode) { return [...appsFor(activeMode), ...foldersFor(activeMode)]; }

function ordered(items) {
  const { order, hidden } = layout[mode];
  const visible = items.filter((item) => !hidden.includes(item.id));
  return [...order.map((id) => visible.find((item) => item.id === id)).filter(Boolean),
    ...visible.filter((item) => !order.includes(item.id))];
}

// --- markup ------------------------------------------------------------------------
function hostLabel(url, where) { const parsed = new URL(url); return where === 'home' ? ((parsed.port ? `:${parsed.port}` : '') + (parsed.pathname === '/' ? '' : parsed.pathname) || parsed.hostname) : parsed.hostname.replace(/^www\./, ''); }
function iconHtml(item) {
  const badge = item.badge ? `<span class="badge">${item.badge}</span>` : '';
  if (item.logo) return `<span class="icon logo"><img src="${ICON_DIR}${item.logo}" alt="" /></span>${badge}`;
  if (item.image) return `<span class="icon full"><img src="${ICON_DIR}${item.image}" alt="" /></span>${badge}`;
  const [a, b, ink = '#fff'] = item.theme ?? ['#64748b', '#334155'];
  return `<span class="icon glyph" style="--ga:${a};--gb:${b};--ink:${ink}"><svg viewBox="0 0 24 24" aria-hidden="true">${GLYPHS[item.glyph] ?? ''}</svg></span>${badge}`;
}
const offlineTag = '<span class="offline-tag">Offline</span>';

function tileHtml(app, featured) {
  const link = app[mode]; const desc = link.desc ?? app.desc; const both = app.home && app.web;
  const vars = [`view-transition-name:vt-${app.id}`];
  if (featured && app.theme) vars.push(`--a:${app.theme[0]}`, `--b:${app.theme[1]}`);
  const state = link.check === false ? 'unchecked' : status.get(`${mode}:${app.id}`) ?? 'checking';
  return `<article class="tile drawer-item app${featured ? ' feature' : ''}" data-item="${app.id}" data-state="${state}" style="${vars.join(';')}"><a class="tile-link" href="${link.url}" target="_blank" rel="noreferrer" draggable="false"><span class="dot" data-state="${state}" title="Checking"></span><span class="ic">${iconHtml(app)}</span><span class="copy"><b>${app.name}</b><small>${desc}</small><span class="meta"><span class="host">${hostLabel(link.url, mode)}</span>${both ? '<span class="both">Home + Web</span>' : ''}</span></span>${offlineTag}</a></article>`;
}

function folderHtml(folder) {
  const minis = folder.children.slice(0, 9).map((child) => `<span class="mini">${iconHtml(child)}</span>`).join('');
  return `<article class="tile drawer-item folder" data-item="${folder.id}" data-state="${folderState(folder)}" style="view-transition-name:vt-${folder.id}"><button class="folder-open" type="button" data-open-folder="${folder.id}" aria-haspopup="dialog"><span class="dot" data-state="${folderState(folder)}"></span><span class="folder-preview" aria-hidden="true">${minis}</span><span class="copy"><b>${folder.name}</b><small>${folder.desc}</small></span></button></article>`;
}

// --- render --------------------------------------------------------------------------
function render() {
  const list = ordered(itemsFor(mode));
  grid.innerHTML = list.map((item) => item.children ? folderHtml(item) : tileHtml(item, false)).join('');
  grid.querySelectorAll('.drawer-item').forEach((tile) => {
    const name = list.find((item) => item.id === tile.dataset.item).name;
    const remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'remove-tile'; remove.textContent = '−';
    remove.setAttribute('aria-label', `Remove ${name}`);
    tile.append(remove);
  });
  document.body.classList.toggle('editing', editing);
  document.body.dataset.mode = mode;
  document.querySelectorAll('[data-set-mode]').forEach((button) => button.setAttribute('aria-checked', String(button.dataset.setMode === mode)));
  balance(); renderStatus(); checkAll();
}

// Animate a DOM change with the browser's View Transitions API where it exists; otherwise just apply it.
// Animate a change to the grid. Uses the browser's View Transitions where available (tiles morph and slide);
// otherwise slides the grid out and back in by hand. With Reduce Motion it's a quick cross-fade instead.
function transition(update, direction = 'none') {
  const reduced = REDUCED_MOTION.matches;
  if (document.startViewTransition) {
    document.documentElement.dataset.dir = reduced ? 'fade' : direction;
    document.startViewTransition(update).finished.finally(() => { delete document.documentElement.dataset.dir; });
    return;
  }
  const shift = reduced || direction === 'none' ? 0 : direction === 'right' ? 40 : -40;
  grid.getAnimations().forEach((animation) => animation.finish());
  grid.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${shift}px)` }], { duration: 140, easing: 'ease-in' })
    .finished.then(() => {
      update();
      grid.animate([{ opacity: 0, transform: `translateX(${-shift}px)` }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2, .8, .2, 1)' });
    });
}

function setMode(next) {
  if (next === mode) return;
  finishEditing();
  // Pages: Web sits to the right of Home, so going to Web slides the tiles off to the left (like a swipe).
  const direction = next === 'web' ? 'left' : 'right';
  mode = next;
  try { localStorage.setItem('app-drawer-mode', mode); } catch {}
  transition(render, direction);
}

// Stretch tiles so the grid never ends with a gap, beside the big tile or on the last row.
function balance() {
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const tiles = [...grid.querySelectorAll('.drawer-item')];
  tiles.forEach((tile) => { tile.style.gridColumn = ''; tile.style.gridRow = ''; tile.classList.remove('wide'); });
  const feature = tiles.find((tile) => tile.classList.contains('feature'));
  const featureSpansRows = feature && getComputedStyle(feature).gridRowEnd.includes('2');
  const small = tiles.filter((tile) => tile !== feature);
  const stretch = (list, width) => list.forEach((tile, index) => {
    const span = Math.floor(width / list.length) + (index < width % list.length ? 1 : 0);
    if (span > 1) { tile.style.gridColumn = `span ${span}`; tile.classList.add('wide'); }
  });

  const sideCols = featureSpansRows ? cols - 2 : 0;
  const beside = small.slice(0, sideCols * 2);
  const rest = small.slice(beside.length);
  if (sideCols && beside.length) {
    if (beside.length <= sideCols) {
      stretch(beside, sideCols);
      beside.forEach((tile) => { tile.style.gridRow = 'span 2'; });
    } else if (beside.length % sideCols) {
      stretch(beside.slice(-(beside.length % sideCols)), sideCols);
    }
  }
  const leftover = rest.length % cols;
  if (leftover) stretch(rest.slice(-leftover), cols);
}

// --- opening sequence: tiles ripple outwards from the big tile ------------------------
function ripple() {
  const tiles = [...grid.querySelectorAll('.drawer-item')];
  if (!tiles.length) return;
  const origin = (grid.querySelector('.feature') ?? tiles[0]).getBoundingClientRect();
  const ox = origin.left + origin.width / 2; const oy = origin.top + origin.height / 2;
  tiles.forEach((tile) => {
    const r = tile.getBoundingClientRect();
    const distance = Math.hypot(r.left + r.width / 2 - ox, r.top + r.height / 2 - oy);
    tile.style.setProperty('--delay', `${100 + distance * 0.16}ms`);
  });
  document.body.classList.add('intro');
  setTimeout(() => document.body.classList.remove('intro'), 900);
}

// --- live status -----------------------------------------------------------------------
async function ping(url) { const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), CHECK_TIMEOUT_MS); try { await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal }); return 'up'; } catch { return 'down'; } finally { clearTimeout(timer); } }

function folderState(folder, activeMode = mode) {
  const states = folder.children.map((_, index) => status.get(`${activeMode}:${folder.id}:${index}`) ?? 'checking');
  if (states.includes('checking')) return 'checking';
  const up = states.filter((state) => state === 'up').length;
  return up === states.length ? 'up' : up === 0 ? 'down' : 'partial';
}

function paint(el, state) {
  if (!el) return;
  const dot = el.querySelector('.dot');
  const cameOnline = el.dataset.state === 'checking' && state === 'up';
  el.dataset.state = state;
  if (!dot) return;
  dot.dataset.state = state;
  dot.title = { up: 'Online', down: 'Not reachable', partial: 'Some not reachable', checking: 'Checking' }[state];
  if (cameOnline) { dot.classList.remove('lit'); void dot.offsetWidth; dot.classList.add('lit'); }
}

function checkAll() {
  const activeMode = mode;
  checkedApps(activeMode).forEach(async (app) => {
    const key = `${activeMode}:${app.id}`;
    if (!status.has(key)) status.set(key, 'checking');
    const result = await ping(app[activeMode].url);
    status.set(key, result);
    if (activeMode !== mode) return;
    paint(grid.querySelector(`[data-item="${app.id}"]`), result);
    renderStatus();
  });
  foldersFor(activeMode).forEach((folder) => folder.children.forEach(async (child, index) => {
    const key = `${activeMode}:${folder.id}:${index}`;
    if (!status.has(key)) status.set(key, 'checking');
    const result = await ping(child.url);
    status.set(key, result);
    if (activeMode !== mode) return;
    paint(grid.querySelector(`[data-item="${folder.id}"]`), folderState(folder));
    if (openFolderId === folder.id) paint(dialog.querySelector(`[data-child="${index}"]`), result);
  }));
}

function renderStatus() {
  const apps = checkedApps(mode);
  const states = apps.map((app) => status.get(`${mode}:${app.id}`) ?? 'checking');
  const up = states.filter((state) => state === 'up').length;
  const note = `<span class="status-note"> · ${MODES[mode].note}</span>`;
  let state = 'ok'; let text = `All ${apps.length} online${note}`;
  if (states.includes('checking')) { state = 'checking'; text = `Checking ${apps.length} services…`; }
  else if (up === 0) { state = 'down'; text = MODES[mode].away; }
  else if (up < apps.length) { state = 'partial'; text = `${up} of ${apps.length} online${note}`; }
  $('#status').dataset.state = state; $('#status-text').innerHTML = text;
}

// --- iPhone-style folders: zoom open from the tile, zoom back into it -------------------
const OPEN_EASE = 'cubic-bezier(.2, .9, .25, 1.04)';
const CLOSE_EASE = 'cubic-bezier(.4, 0, .6, 1)';

function zoomFrames(fromRect, panel) {
  const to = panel.getBoundingClientRect();
  const from = `translate(${fromRect.left - to.left}px, ${fromRect.top - to.top}px) scale(${fromRect.width / to.width}, ${fromRect.height / to.height})`;
  return [{ transform: from, opacity: 0.6 }, { transform: 'none', opacity: 1 }];
}

function openFolder(id, trigger) {
  const folder = FOLDERS.find((item) => item.id === id); if (!folder) return;
  const tile = trigger.closest('.drawer-item');
  openFolderId = id;
  $('#folder-title').textContent = folder.name;
  $('#folder-links').innerHTML = folder.children.map((child, index) => {
    const state = status.get(`${mode}:${folder.id}:${index}`) ?? 'checking';
    return `<a class="folder-app pop" href="${child.url}" target="_blank" rel="noreferrer" data-child="${index}" data-state="${state}" style="--i:${index}"><span class="app-icon">${iconHtml(child)}</span><span class="dot" data-state="${state}"></span><span class="label">${child.name}</span>${offlineTag}</a>`;
  }).join('');

  dialog.showModal();
  document.body.classList.add('folder-open');
  tile.classList.add('is-opening');
  requestAnimationFrame(() => dialog.classList.add('is-open'));
  const panel = dialog.querySelector('.folder-panel');
  if (REDUCED_MOTION.matches) panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
  else panel.animate(zoomFrames(tile.querySelector('.folder-preview').getBoundingClientRect(), panel), { duration: 300, easing: OPEN_EASE });
}

function closeFolder() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  const tile = grid.querySelector(`[data-item="${openFolderId}"]`);
  const finish = () => {
    dialog.classList.remove('is-open', 'is-closing');
    dialog.close();
    document.body.classList.remove('folder-open');
    tile?.classList.remove('is-opening');
    tile?.querySelector('.folder-open')?.focus({ preventScroll: true });
    openFolderId = null;
  };
  dialog.classList.add('is-closing');
  dialog.classList.remove('is-open');
  const panel = dialog.querySelector('.folder-panel');
  let frames = [{ opacity: 1 }, { opacity: 0 }];
  if (tile && !REDUCED_MOTION.matches) {
    frames = zoomFrames(tile.querySelector('.folder-preview').getBoundingClientRect(), panel).reverse();
    frames[1].opacity = 0;
  }
  panel.animate(frames, { duration: 200, easing: CLOSE_EASE, fill: 'forwards' }).finished.then(() => {
    panel.getAnimations().forEach((animation) => animation.cancel());
    finish();
  });
}

// --- swipe between Home and Web on touch screens ---------------------------------------------
// Swipe left to go right to Web, swipe right to go back to Home. Tiles follow the finger while dragging.
const SWIPE_DISTANCE = 70;
let swipe = null;

function resetGridDrag(animate) {
  const from = grid.style.transform;
  grid.style.transform = '';
  grid.style.opacity = '';
  if (animate && from && !REDUCED_MOTION.matches) {
    grid.animate([{ transform: from }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2, .8, .2, 1)' });
  }
}

document.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  // Ignore multi-touch, open folders and the screen edges (the browser's own back/forward swipe).
  if (editing || event.touches.length !== 1 || dialog.open || touch.clientX < 24 || touch.clientX > window.innerWidth - 24) { swipe = null; return; }
  swipe = { x: touch.clientX, y: touch.clientY, dx: 0, axis: null };
}, { passive: true });

document.addEventListener('touchmove', (event) => {
  if (!swipe) return;
  const touch = event.touches[0];
  const dx = touch.clientX - swipe.x;
  const dy = touch.clientY - swipe.y;
  if (!swipe.axis && Math.hypot(dx, dy) > 10) swipe.axis = Math.abs(dx) > Math.abs(dy) * 1.3 ? 'x' : 'y';
  if (swipe.axis !== 'x') return;
  swipe.dx = dx;
  cancelHold();
  const target = dx < 0 ? 'web' : 'home';
  // Drag follows the finger; towards the page you're already on it only stretches a little.
  const pull = target === mode ? dx * 0.12 : dx * 0.35;
  grid.style.transform = `translateX(${pull}px)`;
  grid.style.opacity = String(1 - Math.min(Math.abs(pull) / 320, 0.25));
}, { passive: true });

function endSwipe() {
  if (!swipe) return;
  const { dx, axis } = swipe;
  swipe = null;
  const target = dx < 0 ? 'web' : 'home';
  if (axis === 'x' && Math.abs(dx) > SWIPE_DISTANCE && target !== mode) {
    resetGridDrag(false);
    setMode(target);
  } else {
    resetGridDrag(true);
  }
}
document.addEventListener('touchend', endSwipe);
document.addEventListener('touchcancel', endSwipe);

// --- open links in the Chrome app from the installed phone app ----------------------------
// Only when running as the installed app; in a normal browser tab links behave as usual.
const IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IS_ANDROID = /Android/i.test(navigator.userAgent);
const isInstalledApp = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

// Android: an intent link opens the full Chrome app, or the default browser if Chrome isn't installed.
function androidChromeLink(href) {
  const url = new URL(href);
  const scheme = url.protocol.replace(':', '');
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=${scheme};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url.href)};end`;
}

// iPhone: Chrome's own link scheme hands the page to the Chrome app.
function iosChromeLink(href) {
  return href.replace(/^http(s?):/, (_, secure) => (secure ? 'googlechromes:' : 'googlechrome:'));
}

// If Chrome doesn't take over within a moment (not installed), open the link normally in Safari instead.
function openInChromeOrSafari(href) {
  let leftPage = false;
  const left = () => { leftPage = true; };
  document.addEventListener('visibilitychange', left, { once: true });
  window.addEventListener('pagehide', left, { once: true });
  window.location.href = iosChromeLink(href);
  setTimeout(() => {
    document.removeEventListener('visibilitychange', left);
    window.removeEventListener('pagehide', left);
    if (!leftPage && !document.hidden) window.location.href = href;
  }, 1200);
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="http"]');
  if (!link || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  if (!isInstalledApp() || !(IS_ANDROID || IS_IOS)) return;
  event.preventDefault();
  if (IS_ANDROID) window.location.href = androidChromeLink(link.href);
  else openInChromeOrSafari(link.href);
});

// --- events ------------------------------------------------------------------------------
document.addEventListener('click', (event) => {
  const modeButton = event.target.closest('[data-set-mode]'); if (modeButton) { setMode(modeButton.dataset.setMode); return; }
  const folder = event.target.closest('[data-open-folder]'); if (folder) openFolder(folder.dataset.openFolder, folder);
});
// Like iOS: tap anywhere outside the panel to close. Esc closes too.
dialog.addEventListener('click', (event) => { if (event.target.closest('[data-close-folder]') || !event.target.closest('.folder-panel')) closeFolder(); });
dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeFolder(); });
window.addEventListener('resize', balance);

// --- pinned header: add a soft shadow once the page scrolls under it
const header = $('.top');
new IntersectionObserver(([entry]) => header.classList.toggle('stuck', !entry.isIntersecting)).observe($('#top-sentinel'));

// --- hold to edit, reorder and remove tiles -------------------------------------------
const toast = $('#toast');
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
}

const HOLD_MS = 500;
let hold = null;
let drag = null;
let held = false;
const editBar = document.createElement('div');
editBar.className = 'edit-bar';
editBar.innerHTML = '<span>Drag tiles to move them</span><button type="button" data-restore>Restore removed</button><button type="button" data-done>Done</button>';
grid.before(editBar);
function beginEditing() {
  editing = true;
  document.body.classList.add('editing');
  swipe = null; resetGridDrag(false);
}
function finishEditing() {
  cancelHold();
  endDrag();
  editing = false;
  document.body.classList.remove('editing');
}
function cancelHold() { if (hold) clearTimeout(hold.timer); hold = null; }
function startDrag(item, event) {
  drag = { item, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  grid.setPointerCapture(event.pointerId);
  item.classList.add('is-dragging');
}
function endDrag() {
  if (!drag) return;
  drag.item.classList.remove('is-dragging');
  if (grid.hasPointerCapture(drag.pointerId)) grid.releasePointerCapture(drag.pointerId);
  drag = null;
  balance();
}
grid.addEventListener('pointerdown', (event) => {
  const item = event.target.closest('.drawer-item');
  if (!item || event.button > 0 || event.target.closest('.remove-tile')) return;
  held = false;
  if (editing) { event.preventDefault(); startDrag(item, event); return; }
  hold = { x: event.clientX, y: event.clientY, lastY: event.clientY, scrolling: false, timer: setTimeout(() => {
    held = true;
    navigator.vibrate?.(12);
    beginEditing(); startDrag(item, event);
  }, HOLD_MS) };
});
grid.addEventListener('pointermove', (event) => {
  if (drag) {
    event.preventDefault();
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 10 && !drag.moved) return;
    drag.moved = true; held = true;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.drawer-item');
    if (target && target !== drag.item && grid.contains(target)) {
      const tiles = [...grid.children];
      const forward = tiles.indexOf(target) > tiles.indexOf(drag.item);
      grid.insertBefore(drag.item, forward ? target.nextSibling : target);
      layout[mode].order = [...grid.children].map((tile) => tile.dataset.item);
      saveLayout(); balance();
    }
    if (event.clientY < 80) window.scrollBy(0, -12);
    else if (event.clientY > innerHeight - 80) window.scrollBy(0, 12);
    return;
  }
  if (hold && Math.hypot(event.clientX - hold.x, event.clientY - hold.y) > 10) {
    clearTimeout(hold.timer);
    hold.scrolling = true;
    held = true;
  }
  if (hold?.scrolling && event.pointerType === 'touch') {
    window.scrollBy(0, hold.lastY - event.clientY);
    hold.lastY = event.clientY;
  }
});
window.addEventListener('pointerup', () => { cancelHold(); endDrag(); });
window.addEventListener('pointercancel', () => { cancelHold(); endDrag(); });
grid.addEventListener('lostpointercapture', endDrag);
grid.addEventListener('click', (event) => {
  const remove = event.target.closest('.remove-tile');
  if (remove && editing) {
    event.preventDefault(); event.stopPropagation();
    layout[mode].hidden.push(remove.closest('.drawer-item').dataset.item);
    saveLayout(); render(); return;
  }
  if (editing || held) { event.preventDefault(); event.stopPropagation(); held = false; }
}, true);
grid.addEventListener('contextmenu', (event) => {
  if (!event.target.closest('.drawer-item')) return;
  event.preventDefault(); cancelHold(); beginEditing();
});
grid.addEventListener('keydown', (event) => {
  const tile = event.target.closest('.drawer-item');
  if (!tile) return;
  if (event.key === 'F2') { event.preventDefault(); beginEditing(); }
  if (editing && event.altKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    const previous = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    const target = previous ? tile.previousElementSibling : tile.nextElementSibling;
    if (target) {
      grid.insertBefore(tile, previous ? target : target.nextSibling);
      layout[mode].order = [...grid.children].map((item) => item.dataset.item);
      saveLayout(); balance(); event.target.focus();
    }
  }
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') finishEditing(); });
editBar.addEventListener('click', (event) => {
  if (event.target.closest('[data-done]')) finishEditing();
  if (event.target.closest('[data-restore]')) { layout[mode].hidden = []; saveLayout(); render(); }
});
// iOS Safari only shows :active press styles when the page listens for touches.
document.addEventListener('touchstart', () => {}, { passive: true });

render();
const fontsReady = document.fonts?.ready ?? Promise.resolve();
Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 500))]).then(() => {
  balance();
  document.body.classList.remove('preload');
  ripple();
});
setInterval(checkAll, 60_000);

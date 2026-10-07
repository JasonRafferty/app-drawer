const APPS = [
  { id: 'audiobookshelf', name: 'Audiobookshelf', icon: 'audiobookshelf', theme: ['#f59e0b', '#c2410c'], home: { url: 'http://192.168.0.35:13378', desc: 'Use this for uploads over 100 MB' }, web: { url: 'https://audiobooks.jrapp.co.uk', desc: 'Listen from anywhere' } },
  { id: 'jellyfin', name: 'Jellyfin', desc: 'Films and TV library', icon: 'jellyfin', theme: ['#7b4dff', '#2fa6ff'], home: { url: 'http://192.168.0.35:8096' } },
  { id: 'pihole', name: 'Pi-hole', desc: 'DNS and network controls', icon: 'pi-hole', home: { url: 'http://192.168.0.35/admin' } },
  { id: 'beszel', name: 'Beszel', desc: 'Server health and metrics', icon: 'beszel', home: { url: 'http://192.168.0.35:8090' } },
  { id: 'bridge-invite', name: 'Bridge House Invite', mono: 'B', theme: ['#ff8a3d', '#ff4f6d'], home: { url: 'http://192.168.0.35:3400', desc: 'RSVP and food voting' }, web: { url: 'https://bridgehouseinvite.siplyapp.co.uk', desc: 'RSVP and food voting' } },
  { id: 'portainer', name: 'Portainer', desc: 'Manage Docker containers', icon: 'portainer', web: { url: 'https://portainer.jrapp.co.uk' } },
  { id: 'tutoring', name: 'Tutoring website', desc: 'Jason Rafferty Tutoring', mono: 'T', theme: ['#5b6cff', '#a855f7'], web: { url: 'https://jasonrafferty.github.io' } },
  { id: 'siply-site', name: 'Siply website', desc: 'Marketing site', mono: 'S', theme: ['#2bd4a4', '#1b8cff'], web: { url: 'https://siplyapp.co.uk' } },
];

// Folders keep related links out of the main drawer, much like an iPhone home-screen folder.
const FOLDERS = [
  { id: 'siply-environments', name: 'Siply environments', desc: 'Dev, UAT and admin tools', mode: 'web', preview: ['D', 'U', 'DA', 'UA'], children: [
    { name: 'Siply Dev', url: 'https://dev.siplyapp.co.uk', mono: 'D', color: '#23a6f0' },
    { name: 'Siply UAT', url: 'https://uat.siplyapp.co.uk', mono: 'U', color: '#8b5cf6' },
    { name: 'Siply Dev Admin', url: 'https://dev-admin.siplyapp.co.uk', mono: 'DA', color: '#0f766e' },
    { name: 'Siply UAT Admin', url: 'https://uat-admin.siplyapp.co.uk', mono: 'UA', color: '#d97706' },
  ] },
  { id: 'projects', name: 'Projects', desc: 'Games, tools and source code', mode: 'web', preview: ['♠', '↟', '£', '⌘'], children: [
    { name: 'Blackjack Game', url: 'https://jasonrafferty.github.io/blackjack-game/', mono: '♠', color: '#111827' },
    { name: 'Traffic Notifier', url: 'https://jasonrafferty.github.io/traffic-notifier/', mono: '↟', color: '#2563eb' },
    { name: 'Take-Home Calculator', url: 'https://jasonrafferty.github.io/take-home-calculator/', mono: '£', color: '#15803d' },
    { name: 'Bridge House source', url: 'https://github.com/JasonRafferty/bridge-house-invite', mono: 'B', color: '#ea580c' },
    { name: 'App Drawer source', url: 'https://github.com/JasonRafferty/app-drawer', mono: '⌘', color: '#475569' },
  ] },
];

const FEATURED = { home: 'jellyfin', web: 'audiobookshelf' };
const MODES = { home: { note: 'opens on your home Wi-Fi', away: 'Not reachable. Are you on your home Wi-Fi?' }, web: { note: 'works from anywhere', away: 'Nothing reachable. Check your connection.' } };
const ICON_CDN = 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/';
const CHECK_TIMEOUT_MS = 4000;
const $ = (selector) => document.querySelector(selector);
const grid = $('#grid');
const status = new Map();
let mode = readMode();
let pins = readPins();

function readMode() { try { return localStorage.getItem('app-drawer-mode') === 'home' ? 'home' : 'web'; } catch { return 'web'; } }
function readPins() { try { const saved = JSON.parse(localStorage.getItem('app-drawer-pins') || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); } }
function savePins() { try { localStorage.setItem('app-drawer-pins', JSON.stringify([...pins])); } catch {} }
function appsFor(activeMode) { return APPS.filter((app) => app[activeMode]); }
function foldersFor(activeMode) { return FOLDERS.filter((folder) => folder.mode === activeMode); }
function itemsFor(activeMode) { return [...appsFor(activeMode), ...foldersFor(activeMode)]; }

function ordered(items) {
  const pinOrder = [...pins];
  return [...items].sort((a, b) => {
    const aPin = pins.has(a.id); const bPin = pins.has(b.id);
    if (aPin !== bPin) return aPin ? -1 : 1;
    return pinOrder.indexOf(a.id) - pinOrder.indexOf(b.id);
  });
}

function hostLabel(url, where) { const parsed = new URL(url); return where === 'home' ? ((parsed.port ? `:${parsed.port}` : '') + (parsed.pathname === '/' ? '' : parsed.pathname) || parsed.hostname) : parsed.hostname.replace(/^www\./, ''); }
function iconHtml(app) { if (app.icon) return `<img src="${ICON_CDN}${app.icon}.svg" alt="" loading="lazy" />`; const [a, b] = app.theme ?? ['#64748b', '#334155']; return `<span class="mono" style="background:linear-gradient(140deg,${a},${b})">${app.mono}</span>`; }
function pinButton(item) { const pinned = pins.has(item.id); return `<button class="pin" type="button" data-toggle-pin="${item.id}" aria-pressed="${pinned}" title="${pinned ? 'Unpin' : 'Pin'} ${item.name}"><span aria-hidden="true">${pinned ? '★' : '☆'}</span><span class="sr-only">${pinned ? 'Unpin' : 'Pin'} ${item.name}</span></button>`; }

function tileHtml(app, featured) {
  const link = app[mode]; const desc = link.desc ?? app.desc; const both = app.home && app.web;
  const style = featured && app.theme ? ` style="--a:${app.theme[0]};--b:${app.theme[1]}"` : '';
  const state = status.get(`${mode}:${app.id}`) ?? 'checking';
  return `<article class="tile drawer-item app${featured ? ' feature' : ''}" data-item="${app.id}"${style}><a class="tile-link" href="${link.url}" target="_blank" rel="noreferrer"><span class="dot" data-state="${state}" title="Checking"></span><span class="ic">${iconHtml(app)}</span><span class="copy"><b>${app.name}</b><small>${desc}</small><span class="meta"><span class="host">${hostLabel(link.url, mode)}</span>${both ? '<span class="both">Home + Web</span>' : ''}</span></span></a>${pinButton(app)}</article>`;
}

function folderHtml(folder) {
  return `<article class="tile drawer-item folder" data-item="${folder.id}"><button class="folder-open" type="button" data-open-folder="${folder.id}" aria-haspopup="dialog"><span class="folder-preview" aria-hidden="true">${folder.preview.map((mark, index) => `<span class="preview-${index}">${mark}</span>`).join('')}</span><span class="copy"><b>${folder.name}</b><small>${folder.desc}</small><span class="meta"><span class="both">${folder.children.length} links</span></span></span></button>${pinButton(folder)}</article>`;
}

function render() {
  const list = ordered(itemsFor(mode));
  const featured = list.find((item) => !item.children && pins.has(item.id)) || list.find((item) => item.id === FEATURED[mode]);
  grid.innerHTML = list.map((item) => item.children ? folderHtml(item) : tileHtml(item, item === featured)).join('');
  grid.querySelectorAll('.drawer-item').forEach((tile, index) => tile.style.setProperty('--i', index));
  document.body.dataset.mode = mode;
  document.querySelectorAll('[data-set-mode]').forEach((button) => button.setAttribute('aria-checked', String(button.dataset.setMode === mode)));
  balance(); renderStatus(); checkAll();
}

function setMode(next) { if (next === mode) return; mode = next; try { localStorage.setItem('app-drawer-mode', mode); } catch {} render(); }
function togglePin(id) { if (pins.has(id)) pins.delete(id); else pins.add(id); savePins(); render(); }

function balance() {
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const tiles = [...grid.querySelectorAll('.drawer-item')];
  tiles.forEach((tile) => { tile.style.gridColumn = ''; tile.classList.remove('wide'); });
  const feature = tiles.find((tile) => tile.classList.contains('feature'));
  const featureSpansRows = feature && getComputedStyle(feature).gridRowEnd.includes('2');
  const small = tiles.filter((tile) => tile !== feature); const besideFeature = featureSpansRows ? (cols - 2) * 2 : 0;
  const leftover = Math.max(0, small.length - besideFeature) % cols;
  if (!leftover) return;
  small.slice(-leftover).forEach((tile, index) => { const span = Math.floor(cols / leftover) + (index < cols % leftover ? 1 : 0); if (span > 1) { tile.style.gridColumn = `span ${span}`; tile.classList.add('wide'); } });
}

async function ping(url) { const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), CHECK_TIMEOUT_MS); try { await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal }); return 'up'; } catch { return 'down'; } finally { clearTimeout(timer); } }
function checkAll() { const activeMode = mode; appsFor(activeMode).forEach(async (app) => { const key = `${activeMode}:${app.id}`; if (!status.has(key)) status.set(key, 'checking'); const result = await ping(app[activeMode].url); status.set(key, result); if (activeMode !== mode) return; const dot = grid.querySelector(`[data-item="${app.id}"] .dot`); if (dot) { dot.dataset.state = result; dot.title = result === 'up' ? 'Online' : 'Not reachable'; } renderStatus(); }); }
function renderStatus() { const apps = appsFor(mode); const states = apps.map((app) => status.get(`${mode}:${app.id}`) ?? 'checking'); const up = states.filter((state) => state === 'up').length; let state = 'ok'; let text = `All ${apps.length} online · ${MODES[mode].note}`; if (states.includes('checking')) { state = 'checking'; text = `Checking ${apps.length} services…`; } else if (up === 0) { state = 'down'; text = MODES[mode].away; } else if (up < apps.length) { state = 'partial'; text = `${up} of ${apps.length} online · ${MODES[mode].note}`; } $('#status').dataset.state = state; $('#status-text').textContent = text; }

function openFolder(id) {
  const folder = FOLDERS.find((item) => item.id === id); if (!folder) return;
  $('#folder-title').textContent = folder.name; $('#folder-description').textContent = folder.desc;
  $('#folder-links').innerHTML = folder.children.map((child) => `<a href="${child.url}" target="_blank" rel="noreferrer"><span class="folder-icon" style="background:${child.color}">${child.mono}</span><span>${child.name}</span><span aria-hidden="true">↗</span></a>`).join('');
  const dialog = $('#folder-dialog'); if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
}

document.addEventListener('click', (event) => { const modeButton = event.target.closest('[data-set-mode]'); if (modeButton) { setMode(modeButton.dataset.setMode); return; } const pin = event.target.closest('[data-toggle-pin]'); if (pin) { togglePin(pin.dataset.togglePin); return; } const folder = event.target.closest('[data-open-folder]'); if (folder) openFolder(folder.dataset.openFolder); });
$('#folder-dialog').addEventListener('click', (event) => { if (event.target === $('#folder-dialog') || event.target.closest('[data-close-folder]')) $('#folder-dialog').close(); });
window.addEventListener('resize', balance);
render(); setInterval(checkAll, 60_000);

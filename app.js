// Each app lists where it is hosted: `home` (LAN, on your Wi-Fi) and/or `web` (works anywhere).
// Apps with both appear in either view, linking to the matching address.
const APPS = [
  {
    id: 'audiobookshelf', name: 'Audiobookshelf', icon: 'audiobookshelf', theme: ['#f59e0b', '#c2410c'],
    home: { url: 'http://192.168.0.35:13378', desc: 'Use this for uploads over 100 MB' },
    web: { url: 'https://audiobooks.jrapp.co.uk', desc: 'Listen from anywhere' },
  },
  { id: 'jellyfin', name: 'Jellyfin', desc: 'Films and TV library', icon: 'jellyfin', theme: ['#7b4dff', '#2fa6ff'], home: { url: 'http://192.168.0.35:8096' } },
  { id: 'pihole', name: 'Pi-hole', desc: 'DNS and network controls', icon: 'pi-hole', home: { url: 'http://192.168.0.35/admin' } },
  { id: 'beszel', name: 'Beszel', desc: 'Server health and metrics', icon: 'beszel', home: { url: 'http://192.168.0.35:8090' } },
  { id: 'bridge-invite', name: 'Bridge House Invite', desc: 'RSVP and food voting', mono: 'B', theme: ['#ff8a3d', '#ff4f6d'], home: { url: 'http://192.168.0.35:3400' } },
  { id: 'portainer', name: 'Portainer', desc: 'Manage Docker containers', icon: 'portainer', web: { url: 'https://portainer.jrapp.co.uk' } },
  { id: 'tutoring', name: 'Tutoring website', desc: 'Jason Rafferty Tutoring', mono: 'T', theme: ['#5b6cff', '#a855f7'], web: { url: 'https://jasonrafferty.github.io' } },
  { id: 'siply-site', name: 'Siply website', desc: 'Marketing site', mono: 'S', theme: ['#2bd4a4', '#1b8cff'], web: { url: 'https://siplyapp.co.uk' } },
  { id: 'siply-app', name: 'Siply app', desc: 'Production app', mono: 'S', theme: ['#0ea5e9', '#2563eb'], web: { url: 'https://app.siplyapp.co.uk' } },
  { id: 'bridge-source', name: 'Bridge House source', desc: 'Private GitHub repository', icon: 'github', web: { url: 'https://github.com/JasonRafferty/bridge-house-invite' } },
];

// The big tile in each view.
const FEATURED = { home: 'jellyfin', web: 'audiobookshelf' };

const MODES = {
  home: { note: 'opens on your home Wi-Fi', away: 'Not reachable. Are you on your home Wi-Fi?' },
  web: { note: 'works from anywhere', away: 'Nothing reachable. Check your connection.' },
};

const ICON_CDN = 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/';
const CHECK_TIMEOUT_MS = 4000;

const $ = (sel) => document.querySelector(sel);
const grid = $('#grid');
const status = new Map(); // `${mode}:${id}` -> 'checking' | 'up' | 'down'

let mode = readMode();

function readMode() {
  try {
    return localStorage.getItem('app-drawer-mode') === 'home' ? 'home' : 'web';
  } catch {
    return 'web';
  }
}

function hostLabel(url, where) {
  const u = new URL(url);
  if (where === 'home') return (u.port ? `:${u.port}` : '') + (u.pathname === '/' ? '' : u.pathname) || u.hostname;
  return u.hostname.replace(/^www\./, '');
}

function appsFor(m) {
  return APPS.filter((a) => a[m]);
}

function iconHtml(app) {
  if (app.icon) return `<img src="${ICON_CDN}${app.icon}.svg" alt="" loading="lazy" />`;
  const [a, b] = app.theme ?? ['#64748b', '#334155'];
  return `<span class="mono" style="background:linear-gradient(140deg,${a},${b})">${app.mono}</span>`;
}

function tileHtml(app, featured) {
  const link = app[mode];
  const desc = link.desc ?? app.desc;
  const both = app.home && app.web;
  const style = featured && app.theme ? ` style="--a:${app.theme[0]};--b:${app.theme[1]}"` : '';
  return `
    <a class="tile app${featured ? ' feature' : ''}" href="${link.url}" target="_blank" rel="noreferrer" data-app="${app.id}"${style}>
      <span class="dot" data-state="${status.get(`${mode}:${app.id}`) ?? 'checking'}" title="Checking"></span>
      <span class="ic">${iconHtml(app)}</span>
      <span class="copy">
        <b>${app.name}</b>
        <small>${desc}</small>
        <span class="meta"><span class="host">${hostLabel(link.url, mode)}</span>${both ? '<span class="both">Home + Web</span>' : ''}</span>
      </span>
    </a>`;
}

function render() {
  const list = appsFor(mode);
  const featured = list.find((a) => a.id === FEATURED[mode]);
  const ordered = featured ? [featured, ...list.filter((a) => a !== featured)] : list;
  grid.innerHTML = ordered.map((a) => tileHtml(a, a === featured)).join('');
  grid.querySelectorAll('.app').forEach((el, i) => el.style.setProperty('--i', i));

  document.body.dataset.mode = mode;
  document.querySelectorAll('[data-set-mode]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.setMode === mode)));

  balance();
  renderStatus();
  checkAll();
}

function setMode(next) {
  if (next === mode) return;
  mode = next;
  try {
    localStorage.setItem('app-drawer-mode', mode);
  } catch {}
  render();
}

// Stretch the tiles on the last row so the grid never ends with a gap.
function balance() {
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const tiles = [...grid.querySelectorAll('.app')];
  tiles.forEach((el) => {
    el.style.gridColumn = '';
    el.classList.remove('wide');
  });
  const feature = tiles.find((el) => el.classList.contains('feature'));
  const featureSpansRows = feature && getComputedStyle(feature).gridRowEnd.includes('2');
  const small = tiles.filter((el) => el !== feature);
  const besideFeature = featureSpansRows ? (cols - 2) * 2 : 0;
  const leftover = Math.max(0, small.length - besideFeature) % cols;
  if (!leftover) return;
  small.slice(-leftover).forEach((el, i) => {
    const span = Math.floor(cols / leftover) + (i < cols % leftover ? 1 : 0);
    if (span > 1) {
      el.style.gridColumn = `span ${span}`;
      el.classList.add('wide');
    }
  });
}

// --- live status -----------------------------------------------------------
// A no-cors request resolves when the server answers at all, and rejects when it can't be reached.
async function ping(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CHECK_TIMEOUT_MS);
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal });
    return 'up';
  } catch {
    return 'down';
  } finally {
    clearTimeout(timer);
  }
}

function checkAll() {
  const m = mode;
  appsFor(m).forEach(async (app) => {
    const key = `${m}:${app.id}`;
    if (!status.has(key)) status.set(key, 'checking');
    const result = await ping(app[m].url);
    status.set(key, result);
    if (m !== mode) return;
    const dot = grid.querySelector(`[data-app="${app.id}"] .dot`);
    if (dot) {
      dot.dataset.state = result;
      dot.title = result === 'up' ? 'Online' : 'Not reachable';
    }
    renderStatus();
  });
}

function renderStatus() {
  const list = appsFor(mode);
  const states = list.map((a) => status.get(`${mode}:${a.id}`) ?? 'checking');
  const up = states.filter((s) => s === 'up').length;

  let state = 'ok';
  let text = `All ${list.length} online · ${MODES[mode].note}`;
  if (states.includes('checking')) {
    state = 'checking';
    text = `Checking ${list.length} services…`;
  } else if (up === 0) {
    state = 'down';
    text = MODES[mode].away;
  } else if (up < list.length) {
    state = 'partial';
    text = `${up} of ${list.length} online · ${MODES[mode].note}`;
  }
  $('#status').dataset.state = state;
  $('#status-text').textContent = text;
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-set-mode]');
  if (btn) setMode(btn.dataset.setMode);
});

window.addEventListener('resize', balance);

render();
setInterval(checkAll, 60_000);

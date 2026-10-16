const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

const TITLES = { overview: 'Панель', profile: 'Профиль', locations: 'Локации', store: 'Магазин', settings: 'Настройки', admin: 'Админ-панель' };
const APP_VERSION = '0.6.3';
const ROUTES = { rule: 'Правило', global: 'Глобальный', direct: 'Прямой' };
const THEMES = [
  { id: 'velvet', name: 'Velvet dusk', note: 'Тёплая тёмная', bg: '#171416', rail: '#211d20', panel: '#252023', raised: '#30292d', border: '#443940', text: '#f0e8ed', accent: '#f1c6d7', route: '#713e4d', green: '#b1d987', swatches: ['#171416','#252023','#f1c6d7'] },
  { id: 'midnight', name: 'Midnight', note: 'Глубокий графит', bg: '#111318', rail: '#191c24', panel: '#1d212b', raised: '#272c38', border: '#343b49', text: '#e8edf7', accent: '#b8c8ff', route: '#3a4d83', green: '#9ed8bf', swatches: ['#111318','#1d212b','#b8c8ff'] },
  { id: 'ocean', name: 'Ocean blue', note: 'Холодная синяя', bg: '#10191d', rail: '#17252a', panel: '#1c2b31', raised: '#26383f', border: '#344b53', text: '#e2f1f4', accent: '#9bdceb', route: '#245767', green: '#91d4ae', swatches: ['#10191d','#1c2b31','#9bdceb'] },
  { id: 'forest', name: 'Forest', note: 'Спокойная зелёная', bg: '#131914', rail: '#1d271f', panel: '#242f26', raised: '#303c32', border: '#405345', text: '#e7f0e8', accent: '#b6dda9', route: '#3b6040', green: '#a9d87f', swatches: ['#131914','#242f26','#b6dda9'] },
  { id: 'lavender', name: 'Lavender', note: 'Мягкий фиолетовый', bg: '#17151d', rail: '#211d2b', panel: '#292434', raised: '#352e42', border: '#4a405b', text: '#f0eafa', accent: '#d0b9ff', route: '#564078', green: '#b6dda7', swatches: ['#17151d','#292434','#d0b9ff'] },
  { id: 'rose', name: 'Rose quartz', note: 'Светло-розовая', bg: '#f4eef0', rail: '#e9dfe3', panel: '#fffafb', raised: '#f6e9ee', border: '#e3d3da', text: '#342b30', accent: '#bd6c89', route: '#b05d7b', green: '#65894a', swatches: ['#f4eef0','#fffafb','#bd6c89'] },
  { id: 'sand', name: 'Warm sand', note: 'Тёплая светлая', bg: '#f3efe6', rail: '#e8e1d4', panel: '#fffdf8', raised: '#f6f0e4', border: '#ded5c6', text: '#373127', accent: '#ad7543', route: '#9b6038', green: '#637d42', swatches: ['#f3efe6','#fffdf8','#ad7543'] },
  { id: 'aurora', name: 'Aurora', note: 'Контрастная бирюза', bg: '#101719', rail: '#172326', panel: '#1c2a2d', raised: '#25373a', border: '#34484a', text: '#e8f5f2', accent: '#7ce0c6', route: '#24665b', green: '#a6de83', swatches: ['#101719','#1c2a2d','#7ce0c6'] },
  { id: 'coral', name: 'Coral night', note: 'Тёплый коралловый', bg: '#1a1413', rail: '#261d1b', panel: '#302421', raised: '#3d2c28', border: '#58413a', text: '#f6ece7', accent: '#ffab8d', route: '#814638', green: '#add38e', swatches: ['#1a1413','#302421','#ffab8d'] },
  { id: 'ice', name: 'Arctic ice', note: 'Чистая прохладная', bg: '#edf3f6', rail: '#dce8ed', panel: '#fbfdff', raised: '#e7f0f5', border: '#d1e0e8', text: '#263640', accent: '#347f9f', route: '#3c7790', green: '#5b8b54', swatches: ['#edf3f6','#fbfdff','#347f9f'] }
];
const ACCOUNTS_KEY = 'rezonevpn.demo.accounts.v1';
const SESSION_KEY = 'rezonevpn.demo.session.v1';
const PROFILE_KEY = 'rezonevpn.demo.profile.v1';
const HIDE_IP_KEY = 'rezonevpn.demo.hide-ip.v1';
const DASHBOARD_ORDER_KEY = 'rezonevpn.demo.dashboard-order.v1';
const DEMO_TOGGLES_KEY = 'rezonevpn.demo.toggles.v1';
const ROUTE_KEY = 'rezonevpn.demo.route.v1';
const LOCATION_KEY = 'rezonevpn.demo.location.v1';
const TRANSITIONS_KEY = 'rezonevpn.demo.transitions.v1';
const REMEMBERED_EMAIL_KEY = 'rezonevpn.demo.remembered-email.v1';
const REMEMBERED_SESSION_KEY = 'rezonevpn.demo.remembered-session.v1';
const LOCATION_CONFIG_KEY = 'rezonevpn.demo.location-configs.v1';
const STORE_PRODUCTS_KEY = 'rezonevpn.demo.store-products.v1';
const OWNER_EMAIL = 'hentaipostor@gmail.com';
const ROLE_INFO = {
  member: { name: 'Member', profile: 'Member · участник без подписки', pill: 'MEMBER · БЕЗ ПОДПИСКИ', access: 'Нет подписки', details: 'Доступ к VPN закрыт' },
  custom: { name: 'Custom', profile: 'Custom · подписка активна', pill: 'CUSTOM · VPN-ДОСТУП', access: 'Подписка активна', details: 'Демо-доступ к VPN' },
  dev: { name: 'Dev', profile: 'Dev · владелец', pill: 'DEV · ВЛАДЕЛЕЦ', access: 'Полный доступ', details: 'Управление приложением' }
};
let authMode = 'login';
let activeUser = null;
let pendingAvatar = null;
let networkData = null;
let networkLookupAt = 0;
let networkLookupBusy = false;
let hidePublicIp = localStorage.getItem(HIDE_IP_KEY) === 'true';
let dashboardLayoutMode = false;
let draggedDashboardCard = null;
let suppressDashboardClickUntil = 0;
const DEMO_LOCATIONS = [
  { id: 'ru', flag: '🇷🇺', country: 'Россия', city: 'Москва' },
  { id: 'de', flag: '🇩🇪', country: 'Германия', city: 'Франкфурт' },
  { id: 'nl', flag: '🇳🇱', country: 'Нидерланды', city: 'Амстердам' },
  { id: 'fi', flag: '🇫🇮', country: 'Финляндия', city: 'Хельсинки' }
];
const VPN_SERVICES = [
  { id: 'figma', name: 'Figma', mark: 'F', color: '#a259ff' },
  { id: 'discord', name: 'Discord', mark: 'D', color: '#5865f2' },
  { id: 'telegram', name: 'Telegram', mark: '➤', color: '#229ed9' },
  { id: 'ayugram', name: 'AyuGram', mark: 'A', color: '#4387d6' },
  { id: 'chess', name: 'Chess.com', mark: '♟', color: '#6a994e' },
  { id: 'soundcloud', name: 'SoundCloud', mark: '☁', color: '#ff5500' },
  { id: 'tiktok', name: 'TikTok', mark: '♪', color: '#15151b' },
  { id: 'youtube', name: 'YouTube', mark: '▶', color: '#ff0033' },
  { id: '2ip', name: '2ip.io', mark: 'IP', color: '#38b9e7' },
  { id: 'chatgpt', name: 'ChatGPT', mark: '✳', color: '#18a878' },
  { id: 'twitter', name: 'Twitter / X', mark: 'X', color: '#101114' },
  { id: 'facebook', name: 'Facebook', mark: 'f', color: '#1877f2' },
  { id: 'twitch', name: 'Twitch', mark: '▣', color: '#9146ff' },
  { id: 'cloudflare', name: 'Cloudflare', mark: '☁', color: '#f38020' },
  { id: 'instagram', name: 'Instagram', mark: '◎', color: '#d62976' },
  { id: 'roblox', name: 'Roblox', mark: '◇', color: '#262930' },
  { id: 'gemini', name: 'Gemini', mark: '✦', color: '#4285f4' },
  { id: 'whatsapp', name: 'WhatsApp', mark: '◉', color: '#25d366' },
  { id: 'notion', name: 'Notion', mark: 'N', color: '#fff' }
];
const SERVICE_ICONS = {
  figma: '<path d="M7 3h5v6H7a3 3 0 1 1 0-6Zm5 0h5a3 3 0 1 1 0 6h-5V3Zm0 6h5a3 3 0 1 1 0 6h-5V9Zm-5 0h5v6H7a3 3 0 1 1 0-6Zm0 6h5v3a3 3 0 1 1-5-2.1V15Z"/>',
  discord: '<path d="M19 6.5A16 16 0 0 0 15 5l-.5 1a14 14 0 0 0-5 0L9 5a16 16 0 0 0-4 1.5C2.5 10 2 13.5 2.5 17a16 16 0 0 0 5 2l1-1.5-.8-.4.6-.4a11 11 0 0 0 7.4 0l.6.4-.8.4 1 1.5a16 16 0 0 0 5-2c.7-4-.4-7.5-2.5-10.5ZM8.5 14.5c-1 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.7 2-1.7 2Zm7 0c-1 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.7 2-1.7 2Z"/>',
  telegram: '<path d="m3 11 17-7-4 16-5-6-4 3 .8-5.2L18 7l-8.5 6.1L3 11Z"/>',
  ayugram: '<path d="m3 11 17-7-4 16-5-6-4 3 .8-5.2L18 7l-8.5 6.1L3 11Z"/><path d="m8 17 3-3" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  chess: '<path d="M12 3a2.4 2.4 0 0 0-1.4 4.4L9 10H7l1 3-2 6h12l-2-6 1-3h-2l-1.6-2.6A2.4 2.4 0 0 0 12 3Z"/><path d="M8 16h8" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  soundcloud: '<path d="M3 14a2 2 0 0 1 3.7-1 3 3 0 0 1 5.8 1h4a2.5 2.5 0 1 1 0 5H6a3 3 0 0 1-3-3v-2Zm11-7v6m2-8v8m2-6v6m2-4v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  tiktok: '<path d="M13 3h3c.2 2 1.2 3.3 3 4v3a8 8 0 0 1-3-1v6a5 5 0 1 1-5-5h1v3h-1a2 2 0 1 0 2 2V3Z"/>',
  youtube: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 6 3-6 3V9Z" fill="#fff"/>',
  '2ip': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  chatgpt: '<path d="M12 3.2 14.4 6l3.7.2.4 3.6 2.3 2.2-2.3 2.7-.4 3.5-3.7.2L12 21l-2.4-2.8-3.7-.2-.4-3.5-2.3-2.7 2.3-2.2.4-3.6 3.7-.2L12 3.2Zm0 4.2v9.2m-4-6.9 8 4.6m0-4.6-8 4.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  twitter: '<path d="M4 4h4.2l11.8 16h-4.2L4 4Zm0 16 6.2-7.2m3.6-4.2L20 4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
  facebook: '<path d="M13.5 21v-8h2.8l.4-3h-3.2V8.2c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.6v8h3.4Z"/>',
  twitch: '<path d="M5 3h16v12l-5 5h-4l-3 3v-3H5V3Zm3 3v10h4v3l3-3h3V6H8Z"/><path d="M12 8v5m4-5v5" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  cloudflare: '<path d="M5 17a4 4 0 0 1 .7-8 6.2 6.2 0 0 1 11.8 1.3A3.5 3.5 0 1 1 18 17H5Z"/><path d="M8 20h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.8" r="1.2"/>',
  roblox: '<path fill-rule="evenodd" d="m5 2 17 5-5 15-17-5L5 2Zm2 5-3 9 10 3 3-9L7 7Zm2.8 2.4-1.2 4.4 4.4 1.2 1.2-4.4-4.4-1.2Z"/>',
  gemini: '<path d="M12 2c1.2 5.6 4.4 8.8 10 10-5.6 1.2-8.8 4.4-10 10C10.8 16.4 7.6 13.2 2 12 7.6 10.8 10.8 7.6 12 2Z"/>',
  whatsapp: '<path d="M20 11.8a8 8 0 0 1-11.7 7.1L4 20l1.1-4.1A8 8 0 1 1 20 11.8Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 8.5c.4-.7 1-.6 1.3-.1l.8 1.4c.2.4-.1.7-.5 1.1.6 1.1 1.3 1.7 2.5 2.2.3-.5.7-.8 1.1-.5l1.3.7c.5.3.6.9-.1 1.4-1 .7-2.2.4-3.5-.3-1.5-.8-2.7-2-3.4-3.4-.6-1.1-.6-2 0-2.5Z"/>',
  notion: '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 17V7l8 10V7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>'
};
function serviceIconSvg(id) { return `<svg viewBox="0 0 24 24" aria-hidden="true">${SERVICE_ICONS[id] || '<circle cx="12" cy="12" r="8"/>'}</svg>`; }
const COUNTRY_CODE_BY_NAME = { 'russia':'RU','russian federation':'RU','united states':'US','united states of america':'US','usa':'US','united kingdom':'GB','great britain':'GB','netherlands':'NL','the netherlands':'NL','germany':'DE','finland':'FI','france':'FR','canada':'CA','ukraine':'UA','japan':'JP','australia':'AU','turkey':'TR','singapore':'SG','china':'CN','brazil':'BR','india':'IN','poland':'PL','sweden':'SE','norway':'NO','switzerland':'CH','spain':'ES','italy':'IT','czechia':'CZ','czech republic':'CZ','south korea':'KR','republic of korea':'KR','taiwan':'TW','indonesia':'ID','thailand':'TH','united arab emirates':'AE','hong kong':'HK' };

function safeParse(raw, fallback) { try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function migrateLegacyStorage() {
  const pairs = [
    ['rezonevpn.demo.accounts.v1', 'vela.demo.accounts.v1'],
    ['rezonevpn.demo.session.v1', 'vela.demo.session.v1'],
    ['rezonevpn.demo.profile.v1', 'vela.demo.profile.v1'],
    ['rezonevpn.demo.theme.v1', 'vela.demo.theme.v1']
  ];
  pairs.forEach(([target, legacy]) => {
    if (localStorage.getItem(target) === null && localStorage.getItem(legacy) !== null) localStorage.setItem(target, localStorage.getItem(legacy));
  });
}
migrateLegacyStorage();
function getAccounts() {
  const parsed = safeParse(localStorage.getItem(ACCOUNTS_KEY), []);
  if (!Array.isArray(parsed)) return [];
  let changed = false;
  parsed.forEach(account => {
    if (!account || typeof account !== 'object') return;
    const email = String(account.email || '').trim().toLowerCase();
    const oldRole = account.role || (account.profile && account.profile.role);
    const role = email === OWNER_EMAIL ? 'dev' : oldRole === 'custom' ? 'custom' : 'member';
    if (account.email !== email || account.role !== role) changed = true;
    account.email = email;
    account.role = role;
    if (account.profile && account.profile.role !== role) { account.profile.role = role; changed = true; }
  });
  if (changed) localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(parsed));
  return parsed;
}
function getCurrentProfile() { return safeParse(localStorage.getItem(PROFILE_KEY), null); }
function initials(name) {
  const bits = (name || 'Rezone User').trim().split(/\s+/).slice(0, 2);
  return bits.map(bit => bit[0] || '').join('').toUpperCase() || 'VU';
}
function setAvatar(element, profile) {
  if (profile && profile.avatar) {
    element.innerHTML = `<img src="${profile.avatar}" alt="Фото профиля">`;
  } else {
    element.innerHTML = `<span>${initials(profile && profile.name)}</span>`;
  }
}
function applyTheme(id, notify = false) {
  const theme = THEMES.find(item => item.id === id) || THEMES[0];
  document.documentElement.dataset.theme = theme.id;
  localStorage.setItem('rezonevpn.demo.theme.v1', theme.id);
  document.querySelectorAll('[data-theme-select]').forEach(button => {
    const selected = button.dataset.themeSelect === theme.id;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
    const label = button.querySelector('.theme-choose-label');
    if (label) label.textContent = selected ? 'Выбрана' : 'Применить';
  });
  const phoneThemeName = document.getElementById('phoneThemeName');
  if (phoneThemeName) phoneThemeName.textContent = theme.name;
  const phone = document.getElementById('phoneShell');
  if (phone) {
    phone.classList.remove('theme-change');
    void phone.offsetWidth;
    phone.classList.add('theme-change');
    window.setTimeout(() => phone.classList.remove('theme-change'), 520);
  }
  if (notify) showToast(`Тема «${theme.name}» применена. Это только оформление демо.`);
}
function renderThemes() {
  const grid = document.getElementById('themeGrid');
  grid.innerHTML = THEMES.map(theme => `
    <article class="theme-card" data-preview="${theme.id}">
      <div class="theme-preview" aria-label="Мини-демо темы ${theme.name}">
        <div class="preview-sidebar"><i></i><i></i><i></i></div>
        <div class="preview-content"><div class="preview-top"><span></span><b></b></div><div class="preview-graph"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="preview-bottom"><i></i><i></i></div></div>
      </div>
      <div class="theme-card-info"><div><h3>${theme.name}</h3><p>${theme.note}</p></div><div class="theme-swatches">${theme.swatches.map(() => '<i></i>').join('')}</div></div>
      <button class="theme-choose" type="button" data-theme-select="${theme.id}" aria-pressed="false"><span class="theme-choose-label">Применить</span><span aria-hidden="true">↗</span></button>
    </article>`).join('');
  grid.querySelectorAll('[data-theme-select]').forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeSelect, true)));
  applyTheme(localStorage.getItem('rezonevpn.demo.theme.v1') || 'velvet');
}

function maskIp(ip) {
  if (!ip) return '—';
  return ip.includes(':') ? '••••:••••:••••:••••' : '•••.•••.•••.•••';
}
function displayedIp(ip) { return hidePublicIp ? maskIp(ip) : (ip || '—'); }
function valueOrUnknown(value) { return value === null || value === undefined || value === '' ? 'Не определено' : String(value); }
function networkCompany(data) {
  const company = data.company ?? data.organization;
  if (typeof company === 'string') return company;
  if (company && typeof company === 'object') return company.name || company.company || 'Не определено';
  return data.asn && typeof data.asn === 'object' ? data.asn.org || data.asn.descr || 'Не определено' : 'Не определено';
}
function networkAsn(data) {
  if (typeof data.asn === 'string') return data.asn;
  if (data.asn && typeof data.asn === 'object') {
    const number = data.asn.asn || data.asn.number;
    const org = data.asn.org || data.asn.descr;
    return [number ? `AS${String(number).replace(/^AS/i, '')}` : '', org || ''].filter(Boolean).join(' · ') || 'Не определено';
  }
  return 'Не определено';
}
function countryDetails(data) {
  const location = data && typeof data.location === 'object' ? data.location : {};
  const rawValue = data && (data.country || location.country);
  const raw = typeof rawValue === 'object' && rawValue ? (rawValue.name || rawValue.country || '') : rawValue;
  const codeValue = data && (data.country_code || data.countryCode || data.country_iso || data.country_iso_code || (typeof rawValue === 'object' && rawValue && rawValue.code) || location.country_code || location.countryCode || location.country_iso);
  const normalizedName = String(raw || '').trim().toLowerCase();
  const code = String(codeValue || COUNTRY_CODE_BY_NAME[normalizedName] || (typeof raw === 'string' && /^[a-z]{2}$/i.test(raw) ? raw : '')).toUpperCase();
  let name = '';
  if (/^[A-Z]{2}$/.test(code)) {
    try { name = new Intl.DisplayNames(['ru'], { type: 'region' }).of(code) || ''; } catch {}
  }
  if (!name && typeof raw === 'string' && /[А-Яа-яЁё]/.test(raw)) name = raw;
  if (!name && typeof raw === 'string' && raw.length === 2) {
    try { name = new Intl.DisplayNames(['ru'], { type: 'region' }).of(raw.toUpperCase()) || ''; } catch {}
  }
  const flag = /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map(char => char.charCodeAt(0) + 127397)) : '';
  return { name: name || 'Не определено', code: /^[A-Z]{2}$/.test(code) ? code : '', flag };
}
function renderNetworkData() {
  const data = networkData;
  const location = data && typeof data.location === 'object' ? data.location : {};
  const ip = data && data.ip ? data.ip : '';
  const country = countryDetails(data);
  const city = data && (data.city || data.city_name || location.city || location.town);
  const region = data && (data.region || data.region_name || data.state || location.region || location.region_name || location.state || location.subdivision);
  const placeText = [city, region, country.name !== 'Не определено' ? country.name : ''].filter(Boolean).join(', ');
  document.getElementById('publicIpText').textContent = hidePublicIp && ip ? 'IP скрыт' : (ip || 'Не проверено');
  document.getElementById('publicIpMeta').textContent = ip ? (placeText || 'Регион не определён') : 'Нажмите ↻, чтобы узнать IP и регион';
  document.getElementById('publicCountryFlag').textContent = ip ? country.flag : '';
  document.getElementById('detailIp').textContent = displayedIp(ip);
  document.getElementById('detailCountry').textContent = country.name;
  document.getElementById('detailCountryFlag').textContent = country.flag;
  document.getElementById('detailRegion').textContent = valueOrUnknown(region);
  document.getElementById('detailCity').textContent = valueOrUnknown(city);
  const type = data && ((data.company && typeof data.company === 'object' && data.company.type) || (data.asn && typeof data.asn === 'object' && data.asn.type));
  document.getElementById('detailType').textContent = type || 'Не предоставляется в ответе без ключа';
  document.getElementById('detailCompany').textContent = data ? networkCompany(data) : '—';
  document.getElementById('detailAsn').textContent = data ? networkAsn(data) : '—';
  document.querySelectorAll('.hide-ip-toggle').forEach(toggle => {
    toggle.classList.toggle('on', hidePublicIp);
    toggle.setAttribute('aria-checked', String(hidePublicIp));
  });
}
function setNetworkStatus(message, error = false) {
  const status = document.getElementById('networkQueryStatus');
  status.textContent = message;
  status.classList.toggle('error', error);
}
async function requestNetworkInfo(force = false) {
  if (networkLookupBusy) return;
  if (!force && networkData && Date.now() - networkLookupAt < 5 * 60 * 1000) {
    renderNetworkData();
    setNetworkStatus('Данные уже проверены недавно. Нажмите «Обновить», чтобы запросить их снова.');
    return;
  }
  networkLookupBusy = true;
  const cardButton = document.getElementById('networkRefresh');
  const drawerButton = document.getElementById('networkDrawerRefresh');
  cardButton.disabled = true;
  drawerButton.disabled = true;
  cardButton.classList.add('loading');
  drawerButton.classList.add('loading');
  setNetworkStatus('Проверяем внешний IP и примерную страну…');
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let response;
    try {
      response = await fetch('https://api.ipapi.is/', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal
      });
    } finally {
      window.clearTimeout(timeout);
    }
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) {
      if (response.status === 429) throw new Error('Сервис достиг дневного лимита запросов. Попробуйте позже.');
      if (response.status === 403) throw new Error('Сервис временно отклонил запрос.');
      throw new Error(`Сервис вернул ошибку (${response.status}).`);
    }
    if (data.error || !data.ip) throw new Error(data.error || 'Сервис не вернул публичный IP.');
    networkData = data;
    networkLookupAt = Date.now();
    renderNetworkData();
    setNetworkStatus('Готово. Геолокация по IP приблизительная; источник — ipapi.is.');
  } catch (error) {
    const message = error && error.name === 'AbortError'
      ? 'Ответ не пришёл за 10 секунд. Проверьте подключение и попробуйте снова.'
      : (error && error.message ? error.message : 'Не удалось получить сетевые данные.');
    setNetworkStatus(message, true);
    if (!networkData) {
      document.getElementById('publicIpText').textContent = 'Недоступно';
      document.getElementById('publicIpMeta').textContent = 'Нажмите ↻, чтобы повторить проверку';
    }
  } finally {
    networkLookupBusy = false;
    cardButton.disabled = false;
    drawerButton.disabled = false;
    cardButton.classList.remove('loading');
    drawerButton.classList.remove('loading');
  }
}
function openNetworkDrawer() {
  const overlay = document.getElementById('networkDrawerOverlay');
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  renderNetworkData();
  document.getElementById('networkDrawerClose').focus();
  if (!networkData) requestNetworkInfo(false);
}
function closeNetworkDrawer() {
  const overlay = document.getElementById('networkDrawerOverlay');
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
}

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === 'register';
  document.querySelectorAll('.auth-tab').forEach(tab => {
    const selected = tab.dataset.authMode === mode;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  document.querySelectorAll('.register-only').forEach(element => element.classList.toggle('hidden', !registering));
  document.getElementById('authHeading').textContent = registering ? 'Создать аккаунт' : 'Войти в аккаунт';
  document.getElementById('authSubheading').textContent = registering ? 'Заполните данные — аккаунт будет сохранён локально.' : 'Продолжите работу в своём пространстве.';
  document.getElementById('authSubmit').innerHTML = registering ? 'Создать аккаунт <span aria-hidden="true">↗</span>' : 'Войти <span aria-hidden="true">↗</span>';
  document.getElementById('authPassword').autocomplete = registering ? 'new-password' : 'current-password';
  document.getElementById('authError').textContent = '';
}
function showAuth(message = '') {
  document.getElementById('appLayout').classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
  setAuthMode(getAccounts().length ? 'login' : 'register');
  const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  document.getElementById('authEmail').value = rememberedEmail;
  document.getElementById('rememberMe').checked = Boolean(localStorage.getItem(REMEMBERED_SESSION_KEY));
  document.getElementById('authError').textContent = message;
}
function persistLogin(email) {
  sessionStorage.setItem(SESSION_KEY, email);
  if (document.getElementById('rememberMe').checked) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    localStorage.setItem(REMEMBERED_SESSION_KEY, email);
  } else {
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    localStorage.removeItem(REMEMBERED_SESSION_KEY);
  }
}
function roleName(role) { return ROLE_INFO[role] ? ROLE_INFO[role].name : ROLE_INFO.member.name; }
function roleDescription(role) { return ROLE_INFO[role] ? ROLE_INFO[role].profile : ROLE_INFO.member.profile; }
function escapeHTML(value) { return String(value ?? '').replace(/[&<>\"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[char])); }
function showApp(profile) {
  const email = String(profile.email || '').toLowerCase();
  const accounts = getAccounts();
  const account = accounts.find(item => item.email === email);
  const role = email === OWNER_EMAIL ? 'dev' : (account ? account.role : 'member');
  activeUser = { ...(account && account.profile ? account.profile : profile), ...profile, email, role };
  if (account) { account.role = role; account.profile = { ...(account.profile || {}), ...activeUser, role }; localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(activeUser));
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appLayout').classList.remove('hidden');
  document.getElementById('authPassword').value = '';
  document.getElementById('authPasswordConfirm').value = '';
  document.getElementById('adminNavItem').classList.toggle('hidden', activeUser.role !== 'dev');
  document.getElementById('demoPill').innerHTML = `<i></i> ${ROLE_INFO[activeUser.role]?.pill || ROLE_INFO.member.pill}`;
  refreshProfileView();
  document.querySelector('.rail-item[data-page="overview"]').click();
}
function refreshProfileView() {
  const stored = getCurrentProfile() || activeUser || { name: 'Пользователь', role: 'member', email: '' };
  const email = String(stored.email || '').toLowerCase();
  const account = getAccounts().find(item => item.email === email);
  const role = email === OWNER_EMAIL ? 'dev' : (account ? account.role : stored.role === 'custom' ? 'custom' : 'member');
  const profile = { ...stored, role };
  activeUser = profile;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  document.getElementById('profileDisplayName').textContent = profile.name || 'Пользователь';
  document.getElementById('profileDisplayRole').textContent = roleDescription(role);
  document.getElementById('profileName').value = profile.name || '';
  document.getElementById('profileEmail').value = profile.email || '';
  document.getElementById('profileRoleDisplay').textContent = roleDescription(role);
  document.getElementById('profileAbout').value = profile.about || '';
  setAvatar(document.getElementById('profileAvatar'), profile);
  document.getElementById('editProfile').setAttribute('aria-label', `Профиль: ${profile.name || 'пользователь'}`);
}
function bytesToHex(bytes) { return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join(''); }
async function derivePasswordHash(password, saltHex) {
  if (!crypto.subtle) throw new Error('Безопасная криптография недоступна в этой среде. Запустите приложение в актуальной версии Electron.');
  const salt = Uint8Array.from(saltHex.match(/.{2}/g) || [], byte => parseInt(byte, 16));
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, material, 256);
  return bytesToHex(derived);
}
function randomSalt() { return bytesToHex(crypto.getRandomValues(new Uint8Array(16))); }
function reportAuthError(message) { document.getElementById('authError').textContent = message; }

document.querySelectorAll('.auth-tab').forEach(tab => tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode)));
document.getElementById('authForm').addEventListener('submit', async event => {
  event.preventDefault();
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value;
  reportAuthError('');
  if (!email || !document.getElementById('authEmail').checkValidity()) return reportAuthError('Укажите корректный адрес электронной почты.');
  if (password.length < 8) return reportAuthError('Пароль должен содержать не менее 8 символов.');
  const submit = document.getElementById('authSubmit');
  submit.disabled = true;
  try {
    const accounts = getAccounts();
    if (authMode === 'register') {
      const name = document.getElementById('authName').value.trim();
      const confirm = document.getElementById('authPasswordConfirm').value;
      if (name.length < 2) return reportAuthError('Введите имя (не менее 2 символов).');
      if (password !== confirm) return reportAuthError('Пароли не совпадают.');
      if (accounts.some(account => account.email === email)) return reportAuthError('Аккаунт с такой почтой уже есть. Войдите в него.');
      const salt = randomSalt();
      const passwordHash = await derivePasswordHash(password, salt);
      const role = email === OWNER_EMAIL ? 'dev' : 'member';
      const profile = { name, role, email, about: '', avatar: '' };
      accounts.push({ email, salt, passwordHash, role, profile });
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      persistLogin(email);
      showApp(profile);
      showToast('Демо-аккаунт создан и сохранён на этом устройстве.');
    } else {
      const account = accounts.find(item => item.email === email);
      if (!account) return reportAuthError('Аккаунт не найден. Перейдите в «Регистрация», чтобы создать демо-аккаунт.');
      const passwordHash = await derivePasswordHash(password, account.salt);
      if (passwordHash !== account.passwordHash) return reportAuthError('Неверная почта или пароль.');
      persistLogin(email);
      const profile = { ...(account.profile || { name: email.split('@')[0], email }), role: account.role };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      showApp(profile);
      showToast('Вы вошли в локальный демо-аккаунт.');
    }
  } catch (error) {
    reportAuthError(error && error.message ? error.message : 'Не удалось выполнить действие. Попробуйте ещё раз.');
  } finally {
    submit.disabled = false;
  }
});

function navigate(page) {
  if (page === 'admin' && (!activeUser || activeUser.role !== 'dev')) {
    showToast('Админ-панель доступна только владельцу с ролью DEV.');
    page = 'overview';
  }
  if (page !== 'overview' && dashboardLayoutMode) setDashboardLayoutMode(false, true);
  document.querySelectorAll('.rail-item[data-page]').forEach(item => item.classList.toggle('active', item.dataset.page === page));
  document.getElementById('pageTitle').textContent = TITLES[page] || 'Панель';
  const views = { profile: 'profilePage', locations: 'locationsPage', store: 'storePage', settings: 'settingsPage', admin: 'adminPage' };
  ['connectionHero', 'dashboardGrid', 'memberGate', 'profilePage', 'locationsPage', 'storePage', 'settingsPage', 'adminPage'].forEach(id => document.getElementById(id).classList.add('hidden'));
  let activeView;
  if (page === 'overview') {
    const vpnAllowed = activeUser && (activeUser.role === 'custom' || activeUser.role === 'dev');
    activeView = document.getElementById(vpnAllowed ? 'dashboardGrid' : 'memberGate');
    activeView.classList.remove('hidden');
    document.getElementById('connectionHero').classList.toggle('hidden', !vpnAllowed);
    document.getElementById('layoutModeButton').classList.toggle('hidden', !vpnAllowed);
  } else {
    activeView = document.getElementById(views[page]);
    if (activeView) activeView.classList.remove('hidden');
    document.getElementById('layoutModeButton').classList.add('hidden');
  }
  if (activeView) {
    activeView.classList.remove('page-enter');
    void activeView.offsetWidth;
    activeView.classList.add('page-enter');
  }
  if (page === 'profile') refreshProfileView();
  if (page === 'settings') {
    applyTheme(localStorage.getItem('rezonevpn.demo.theme.v1') || 'velvet');
    syncHideIpToggles();
  }
  if (page === 'locations') renderLocations();
  if (page === 'store') renderStore();
  if (page === 'admin') renderAdminPage();
  document.querySelector('.main-area').scrollTop = 0;
}
function setDashboardLayoutMode(enabled, silent = false) {
  if (enabled && (!activeUser || !['custom', 'dev'].includes(activeUser.role))) {
    showToast('Настройка панели доступна после открытия демо-панели.');
    return;
  }
  dashboardLayoutMode = Boolean(enabled);
  const grid = document.getElementById('dashboardGrid');
  const button = document.getElementById('layoutModeButton');
  grid.classList.toggle('reorder-mode', dashboardLayoutMode);
  button.setAttribute('aria-pressed', String(dashboardLayoutMode));
  button.querySelector('span').textContent = dashboardLayoutMode ? 'Готово' : 'Настроить';
  button.title = dashboardLayoutMode ? 'Завершить настройку панели' : 'Переместить карточки панели';
  document.querySelectorAll('.card-drag-handle').forEach(handle => { handle.draggable = dashboardLayoutMode; });
  if (dashboardLayoutMode) showToast('Зажмите карточку и перетащите; ручки и стрелки тоже доступны.');
  else if (!silent) showToast('Порядок карточек панели сохранён.');
}
function setupDashboardLayout() {
  const grid = document.getElementById('dashboardGrid');
  const cards = [...document.querySelectorAll('[data-dashboard-card]')];
  const rawStored = safeParse(localStorage.getItem(DASHBOARD_ORDER_KEY), []);
  const stored = Array.isArray(rawStored) ? rawStored : [];
  const ids = cards.map(card => card.dataset.dashboardCard);
  const ordered = [...stored.filter(id => ids.includes(id)), ...ids.filter(id => !stored.includes(id))];
  const applyOrder = (list, animate = true) => {
    const before = new Map(cards.map(card => [card, card.getBoundingClientRect()]));
    list.forEach((id, index) => {
      const card = cards.find(item => item.dataset.dashboardCard === id);
      if (card) card.dataset.order = String(index);
    });
    void grid.offsetWidth;
    if (animate && document.documentElement.dataset.transitions !== 'off' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach(card => {
        const previous = before.get(card);
        const next = card.getBoundingClientRect();
        const dx = previous.left - next.left;
        const dy = previous.top - next.top;
        if (Math.abs(dx) + Math.abs(dy) > 2) card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: 360, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    }
    localStorage.setItem(DASHBOARD_ORDER_KEY, JSON.stringify(list));
  };
  const currentOrder = () => [...cards].sort((a,b) => Number(a.dataset.order || 0) - Number(b.dataset.order || 0)).map(card => card.dataset.dashboardCard);
  const moveCard = (card, target, after = false) => {
    if (card === target) return;
    const order = currentOrder();
    const draggedId = card.dataset.dashboardCard;
    const withoutDragged = order.filter(id => id !== draggedId);
    const targetIndex = withoutDragged.indexOf(target.dataset.dashboardCard);
    const insertAt = Math.max(0, targetIndex + (after ? 1 : 0));
    if (order.indexOf(draggedId) === insertAt) return;
    withoutDragged.splice(insertAt, 0, draggedId);
    applyOrder(withoutDragged);
  };
  let pointerDrag = null;
  document.addEventListener('pointerdown', event => {
    const card = event.target.closest('[data-dashboard-card]');
    if (!card || !grid.contains(card) || event.button !== 0 || event.target.closest('button,a,input,select,textarea,[contenteditable="true"]')) return;
    pointerDrag = { card, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, active: false };
  });
  document.addEventListener('pointermove', event => {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    const dx = event.clientX - pointerDrag.startX;
    const dy = event.clientY - pointerDrag.startY;
    if (!pointerDrag.active && Math.hypot(dx, dy) < 7) return;
    if (!pointerDrag.active) {
      pointerDrag.active = true;
      pointerDrag.card.classList.add('is-pointer-dragging');
      document.body.classList.add('dashboard-drag-active');
      try { pointerDrag.card.setPointerCapture(event.pointerId); } catch {}
    }
    event.preventDefault();
    const target = document.elementsFromPoint(event.clientX, event.clientY).map(element => element.closest('[data-dashboard-card]')).find(item => item && item !== pointerDrag.card && grid.contains(item));
    cards.forEach(item => item.classList.toggle('drop-target', item === target));
    if (target && grid.contains(target) && target !== pointerDrag.card) {
      const rect = target.getBoundingClientRect();
      moveCard(pointerDrag.card, target, event.clientY > rect.top + rect.height / 2);
    }
  }, { passive: false });
  const finishPointerDrag = event => {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    if (pointerDrag.active) {
      suppressDashboardClickUntil = Date.now() + 350;
      pointerDrag.card.classList.remove('is-pointer-dragging');
      document.body.classList.remove('dashboard-drag-active');
      cards.forEach(item => item.classList.remove('drop-target'));
    }
    pointerDrag = null;
  };
  document.addEventListener('pointerup', finishPointerDrag);
  document.addEventListener('pointercancel', finishPointerDrag);
  applyOrder(ordered, false);
  cards.forEach(card => {
    const handle = document.createElement('button');
    handle.className = 'card-drag-handle';
    handle.type = 'button';
    handle.draggable = false;
    handle.setAttribute('aria-label', `Переместить карточку «${card.querySelector('h2')?.textContent || 'карточка'}»`);
    handle.title = 'Перетащить карточку; стрелки ← ↑ → ↓ меняют порядок';
    handle.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h.01M11 3h.01M5 8h.01M11 8h.01M5 13h.01M11 13h.01"/></svg>';
    const head = card.querySelector('.panel-head');
    if (head) head.append(handle);
    handle.addEventListener('dragstart', event => {
      if (!dashboardLayoutMode) { event.preventDefault(); return; }
      draggedDashboardCard = card;
      card.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.dataset.dashboardCard);
    });
    handle.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      cards.forEach(item => item.classList.remove('drop-target'));
      draggedDashboardCard = null;
    });
    handle.addEventListener('keydown', event => {
      if (!dashboardLayoutMode || !['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const order = currentOrder();
      const index = order.indexOf(card.dataset.dashboardCard);
      const delta = ['ArrowLeft','ArrowUp'].includes(event.key) ? -1 : 1;
      const targetIndex = Math.min(order.length - 1, Math.max(0, index + delta));
      if (targetIndex === index) return;
      [order[index], order[targetIndex]] = [order[targetIndex], order[index]];
      applyOrder(order);
      handle.focus();
    });
    card.addEventListener('dragover', event => {
      if (!dashboardLayoutMode || !draggedDashboardCard || draggedDashboardCard === card) return;
      event.preventDefault();
      card.classList.add('drop-target');
      event.dataTransfer.dropEffect = 'move';
    });
    card.addEventListener('dragleave', event => {
      if (!card.contains(event.relatedTarget)) card.classList.remove('drop-target');
    });
    card.addEventListener('drop', event => {
      if (!dashboardLayoutMode || !draggedDashboardCard || draggedDashboardCard === card) return;
      event.preventDefault();
      const rect = card.getBoundingClientRect();
      const after = event.clientY > rect.top + rect.height / 2;
      moveCard(draggedDashboardCard, card, after);
      card.classList.remove('drop-target');
    });
  });
}
function setTransitionsEnabled(enabled) {
  const toggle = document.getElementById('transitionsToggle');
  document.documentElement.dataset.transitions = enabled ? 'on' : 'off';
  localStorage.setItem(TRANSITIONS_KEY, String(enabled));
  if (toggle) {
    toggle.classList.toggle('on', enabled);
    toggle.setAttribute('aria-checked', String(enabled));
  }
}
function syncHideIpToggles() {
  document.querySelectorAll('.hide-ip-toggle').forEach(toggle => {
    toggle.classList.toggle('on', hidePublicIp);
    toggle.setAttribute('aria-checked', String(hidePublicIp));
  });
}
function selectDemoRoute(route) {
  if (!ROUTES[route]) return;
  localStorage.setItem(ROUTE_KEY, route);
  document.querySelectorAll('[data-route]').forEach(item => item.classList.toggle('selected', item.dataset.route === route));
  showToast(`Режим «${ROUTES[route]}» выбран только для демонстрации. Маршрутизация не меняется.`);
}
function setDemoToggle(name, enabled) {
  const parsed = safeParse(localStorage.getItem(DEMO_TOGGLES_KEY), { proxy: true, tun: true });
  const toggles = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : { proxy: true, tun: true };
  toggles[name] = Boolean(enabled);
  localStorage.setItem(DEMO_TOGGLES_KEY, JSON.stringify(toggles));
  document.querySelectorAll(`[data-toggle="${name}"]`).forEach(button => {
    button.setAttribute('aria-pressed', String(enabled));
    button.classList.toggle('on', enabled);
    const label = button.closest('.switch-card')?.querySelector('.switch-label');
    if (label) label.innerHTML = `${enabled ? 'Включено' : 'Выключено'} <small>· демо</small>`;
  });
}
function toggleDemoSetting(name) {
  const parsed = safeParse(localStorage.getItem(DEMO_TOGGLES_KEY), { proxy: true, tun: true });
  const toggles = parsed && typeof parsed === 'object' ? parsed : { proxy: true, tun: true };
  setDemoToggle(name, toggles[name] !== true);
  showToast('Сохранён демо-параметр; системные и сетевые настройки не менялись.');
}
function readLocationConfigs() {
  const value = safeParse(localStorage.getItem(LOCATION_CONFIG_KEY), {});
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}
function getLocationConfig(locationId) {
  const configs = readLocationConfigs();
  const value = configs[locationId];
  return { mode: value && value.mode === 'full' ? 'full' : 'combined', services: Array.isArray(value && value.services) ? value.services.filter(id => VPN_SERVICES.some(service => service.id === id)) : [] };
}
function saveLocationConfig(locationId, config) {
  const configs = readLocationConfigs();
  configs[locationId] = { mode: config.mode === 'full' ? 'full' : 'combined', services: [...new Set((config.services || []).filter(id => VPN_SERVICES.some(service => service.id === id)))] };
  localStorage.setItem(LOCATION_CONFIG_KEY, JSON.stringify(configs));
}
function renderLocations() {
  const selected = localStorage.getItem(LOCATION_KEY) || '';
  const current = DEMO_LOCATIONS.find(item => item.id === selected);
  document.getElementById('selectedLocationLabel').textContent = current ? `${current.flag} ${current.country}, ${current.city}` : 'Не выбрана';
  document.getElementById('locationGrid').innerHTML = DEMO_LOCATIONS.map(location => `
    <button class="panel location-card ${location.id === selected ? 'selected' : ''}" type="button" data-location="${location.id}" aria-pressed="${location.id === selected}">
      <span class="location-flag" aria-hidden="true">${location.flag}</span><span class="location-copy"><strong>${location.country}</strong><small>${location.city} · демо-узел</small></span><span class="location-state">${location.id === selected ? 'Настроить' : 'Выбрать'}</span>
    </button>`).join('');
  const settings = document.getElementById('vpnLocationSettings');
  if (!current) { settings.classList.add('hidden'); return; }
  settings.classList.remove('hidden');
  document.getElementById('vpnLocationTitle').textContent = `${current.flag} ${current.country} · ${current.city}`;
  const config = getLocationConfig(current.id);
  const fullMode = config.mode === 'full';
  document.getElementById('combinedVpnMode').classList.toggle('selected', !fullMode);
  document.getElementById('combinedVpnMode').setAttribute('aria-checked', String(!fullMode));
  document.getElementById('fullVpnMode').classList.toggle('selected', fullMode);
  document.getElementById('fullVpnMode').setAttribute('aria-checked', String(fullMode));
  document.getElementById('combinedServiceList').classList.toggle('hidden', fullMode);
  document.getElementById('fullVpnNote').classList.toggle('hidden', !fullMode);
  if (fullMode) {
    document.getElementById('serviceGrid').innerHTML = '';
    return;
  }
  document.getElementById('serviceSelectionCount').textContent = `${config.services.length} выбрано`;
  document.getElementById('serviceSelectionHint').textContent = 'Выберите сервисы для комбинированного режима';
  document.getElementById('serviceGrid').innerHTML = VPN_SERVICES.map(service => {
    const enabled = config.services.includes(service.id);
    return `<button class="service-option ${enabled ? 'selected' : ''}" type="button" data-service="${service.id}" aria-pressed="${enabled}"><span class="service-brand" data-brand="${service.id}" aria-hidden="true">${serviceIconSvg(service.id)}</span><span>${service.name}</span></button>`;
  }).join('');
}
function selectLocation(locationId) {
  const location = DEMO_LOCATIONS.find(item => item.id === locationId);
  if (!location) return;
  localStorage.setItem(LOCATION_KEY, location.id);
  renderLocations();
  showToast(`Выбрана демо-локация: ${location.country}, ${location.city}. Подключение не настроено.`);
}
function updateLocationMode(mode) {
  const locationId = localStorage.getItem(LOCATION_KEY);
  if (!locationId || !['combined','full'].includes(mode)) return;
  const config = getLocationConfig(locationId);
  saveLocationConfig(locationId, { ...config, mode });
  renderLocations();
}
function toggleLocationService(serviceId) {
  const locationId = localStorage.getItem(LOCATION_KEY);
  if (!locationId) return;
  const config = getLocationConfig(locationId);
  if (config.mode === 'full' || !VPN_SERVICES.some(service => service.id === serviceId)) return;
  const services = new Set(config.services);
  services.has(serviceId) ? services.delete(serviceId) : services.add(serviceId);
  saveLocationConfig(locationId, { ...config, services: [...services] });
  renderLocations();
}
function readStoreProducts() {
  const value = safeParse(localStorage.getItem(STORE_PRODUCTS_KEY), []);
  return Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : [];
}
function renderStore() {
  const products = readStoreProducts();
  document.getElementById('productCount').textContent = `${products.length} ${products.length === 1 ? 'товар' : products.length >= 2 && products.length <= 4 ? 'товара' : 'товаров'}`;
  document.getElementById('productGrid').innerHTML = products.map((product, index) => `
    <article class="panel product-card"><div class="product-mark" aria-hidden="true">${escapeHTML((product.name || 'Т').slice(0,1).toUpperCase())}</div><div class="product-card-copy"><h3>${escapeHTML(product.name)}</h3><p>${escapeHTML(product.description)}</p>${product.price ? `<strong class="product-price">${escapeHTML(product.price)}</strong>` : '<span class="product-price product-price-empty">Цена не указана</span>'}${product.url ? `<a class="product-link" href="${escapeHTML(product.url)}" target="_blank" rel="noreferrer">Открыть сайт ↗</a>` : ''}</div><button type="button" class="product-remove" data-product-remove="${index}" aria-label="Удалить товар ${escapeHTML(product.name)}">×</button></article>`).join('') || '<div class="store-empty"><span aria-hidden="true">▢</span><h3>Каталог пока пуст</h3><p>Добавьте свои товары с актуальными описаниями и стоимостью.</p></div>';
}

function renderAdminPage() {
  if (!activeUser || activeUser.role !== 'dev') return;
  const accounts = getAccounts().sort((a, b) => (a.role === 'dev' ? -1 : 0) - (b.role === 'dev' ? -1 : 0) || a.email.localeCompare(b.email));
  document.getElementById('adminTotal').textContent = String(accounts.length);
  document.getElementById('adminMemberCount').textContent = String(accounts.filter(account => account.role === 'member').length);
  document.getElementById('adminCustomCount').textContent = String(accounts.filter(account => account.role === 'custom').length);
  document.getElementById('adminDevCount').textContent = String(accounts.filter(account => account.role === 'dev').length);
  const body = document.getElementById('adminUsersBody');
  body.innerHTML = accounts.map(account => {
    const profile = account.profile || {};
    const email = escapeHTML(account.email);
    const name = escapeHTML(profile.name || account.email);
    const encodedEmail = encodeURIComponent(account.email);
    const role = account.role || 'member';
    const access = role === 'custom' ? '<span class="access-pill custom">Подписка активна<br><small>VPN-доступ · демо</small></span>' : role === 'dev' ? '<span class="access-pill dev">Полный доступ<br><small>Владелец приложения</small></span>' : '<span class="access-pill member">Нет подписки<br><small>VPN-доступ закрыт</small></span>';
    const control = role === 'dev' ? '<span class="owner-lock">DEV · защищено</span>' : `<select class="admin-role-select" data-account-email="${encodedEmail}" aria-label="Роль для ${email}"><option value="member" ${role === 'member' ? 'selected' : ''}>Member</option><option value="custom" ${role === 'custom' ? 'selected' : ''}>Custom</option></select>`;
    return `<tr><td><strong>${name}</strong><span class="account-email">${email}</span></td><td><span class="role-chip ${role}">${roleName(role)}</span></td><td>${access}</td><td>${control}</td></tr>`;
  }).join('') || '<tr><td colspan="4" class="empty-table">Локальных аккаунтов пока нет.</td></tr>';
}
function updateAccountRole(email, role) {
  if (!activeUser || activeUser.role !== 'dev') return showToast('Недостаточно прав для управления ролями.');
  if (!['member', 'custom'].includes(role)) return;
  if (email.toLowerCase() === OWNER_EMAIL) return showToast('Роль владельца DEV нельзя изменить.');
  const accounts = getAccounts();
  const account = accounts.find(item => item.email === email.toLowerCase());
  if (!account) return showToast('Аккаунт не найден.');
  account.role = role;
  account.profile = { ...(account.profile || {}), role };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  renderAdminPage();
  showToast(role === 'custom' ? 'Роль Custom назначена: демо-доступ к VPN открыт.' : 'Пользователь переведён в Member: VPN-доступ закрыт.');
}
document.getElementById('adminUsersBody').addEventListener('change', event => {
  const select = event.target.closest('[data-account-email]');
  if (!select) return;
  updateAccountRole(decodeURIComponent(select.dataset.accountEmail), select.value);
});
document.getElementById('networkCard').addEventListener('click', event => {
  if (Date.now() < suppressDashboardClickUntil || event.target.closest('button')) return;
  openNetworkDrawer();
});
document.getElementById('networkCard').addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openNetworkDrawer();
  }
});
document.getElementById('networkInfo').addEventListener('click', event => {
  event.stopPropagation();
  openNetworkDrawer();
});
document.getElementById('networkRefresh').addEventListener('click', event => {
  event.stopPropagation();
  openNetworkDrawer();
  requestNetworkInfo(true);
});
document.getElementById('networkDrawerRefresh').addEventListener('click', () => requestNetworkInfo(true));
document.getElementById('networkDrawerClose').addEventListener('click', closeNetworkDrawer);
document.getElementById('networkDrawerOverlay').addEventListener('click', event => {
  if (event.target === event.currentTarget) closeNetworkDrawer();
});
document.querySelectorAll('.hide-ip-toggle').forEach(toggle => toggle.addEventListener('click', () => {
  hidePublicIp = !hidePublicIp;
  localStorage.setItem(HIDE_IP_KEY, String(hidePublicIp));
  renderNetworkData();
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !document.getElementById('networkDrawerOverlay').classList.contains('hidden')) closeNetworkDrawer();
});
document.querySelectorAll('.rail-item[data-page]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
document.getElementById('heroLocations').addEventListener('click', () => navigate('locations'));
document.getElementById('heroNetworkCheck').addEventListener('click', () => openNetworkDrawer());
document.getElementById('layoutModeButton').addEventListener('click', () => setDashboardLayoutMode(!dashboardLayoutMode));
document.getElementById('openLayoutSettings').addEventListener('click', () => {
  navigate('overview');
  setDashboardLayoutMode(true);
});
document.getElementById('themeOptionsToggle').addEventListener('click', event => {
  const button = event.currentTarget;
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  document.getElementById('themeGrid').classList.toggle('hidden', expanded);
  button.querySelector('span').textContent = expanded ? '⌄' : '⌃';
});
document.getElementById('transitionsToggle').addEventListener('click', () => setTransitionsEnabled(document.getElementById('transitionsToggle').getAttribute('aria-checked') !== 'true'));
document.getElementById('updateLogToggle').addEventListener('click', event => {
  const button = event.currentTarget;
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  document.getElementById('updateLog').classList.toggle('hidden', expanded);
  button.querySelector('span').textContent = expanded ? '⌄' : '⌃';
});
document.getElementById('authScreen').addEventListener('copy', event => {
  if (!event.target.closest('input, textarea')) event.preventDefault();
});
document.getElementById('openNetworkSettings').addEventListener('click', () => openNetworkDrawer());
document.getElementById('hideIpSettingsToggle').addEventListener('click', () => {
  hidePublicIp = !hidePublicIp;
  localStorage.setItem(HIDE_IP_KEY, String(hidePublicIp));
  renderNetworkData();
});
document.getElementById('locationGrid').addEventListener('click', event => {
  const button = event.target.closest('[data-location]');
  if (button) selectLocation(button.dataset.location);
});
document.getElementById('vpnLocationSettings').addEventListener('click', event => {
  const modeButton = event.target.closest('[data-vpn-mode]');
  if (modeButton) return updateLocationMode(modeButton.dataset.vpnMode);
  const serviceButton = event.target.closest('[data-service]');
  if (serviceButton) toggleLocationService(serviceButton.dataset.service);
});
document.getElementById('storeForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('productName').value.trim();
  const description = document.getElementById('productDescription').value.trim();
  const price = document.getElementById('productPrice').value.trim();
  const rawUrl = document.getElementById('productUrl').value.trim();
  if (name.length < 2 || !description) return showToast('Добавьте название и описание товара.');
  if (rawUrl && !/^https:\/\//i.test(rawUrl)) return showToast('Ссылка на товар должна начинаться с https://.');
  const products = readStoreProducts();
  products.push({ name, description, price, url: rawUrl });
  localStorage.setItem(STORE_PRODUCTS_KEY, JSON.stringify(products));
  event.currentTarget.reset();
  renderStore();
  showToast('Товар добавлен в локальный каталог. На сайт он не опубликован.');
});
document.getElementById('productGrid').addEventListener('click', event => {
  const button = event.target.closest('[data-product-remove]');
  if (!button) return;
  const products = readStoreProducts();
  products.splice(Number(button.dataset.productRemove), 1);
  localStorage.setItem(STORE_PRODUCTS_KEY, JSON.stringify(products));
  renderStore();
});
document.getElementById('editProfile').addEventListener('click', () => navigate('profile'));

document.querySelectorAll('[data-route]').forEach(button => {
  button.addEventListener('click', () => selectDemoRoute(button.dataset.route));
});
document.querySelectorAll('[data-toggle]').forEach(button => {
  button.addEventListener('click', () => toggleDemoSetting(button.dataset.toggle));
});
document.getElementById('routeInfo').addEventListener('click', () => showToast('Режимы Правило, Глобальный и Прямой отображаются в макете — правила маршрутизации не применяются.'));
document.getElementById('serviceStatus').addEventListener('click', () => showToast('Демо запущено, VPN-ядро не подключено и трафик не защищён.'));
document.getElementById('helpButton').addEventListener('click', () => showToast(`RezoneVPN · интерфейсный прототип ${APP_VERSION}.`));

document.getElementById('profileForm').addEventListener('submit', event => {
  event.preventDefault();
  const old = getCurrentProfile() || activeUser || {};
  const profile = { ...old, name: document.getElementById('profileName').value.trim(), about: document.getElementById('profileAbout').value.trim(), avatar: pendingAvatar || old.avatar || '' };
  if (profile.name.length < 2) return showToast('Имя должно содержать не менее 2 символов.');
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  const accounts = getAccounts();
  const account = accounts.find(item => item.email === profile.email);
  if (account) { account.profile = profile; localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); }
  pendingAvatar = null;
  refreshProfileView();
  showToast('Профиль сохранён локально на этом устройстве.');
});
document.getElementById('avatarFile').addEventListener('change', event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Выберите изображение размером до 5 МБ.'); event.target.value = ''; return; }
  const reader = new FileReader();
  reader.onerror = () => showToast('Не удалось прочитать изображение.');
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 512 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      pendingAvatar = canvas.toDataURL('image/jpeg', .82);
      setAvatar(document.getElementById('profileAvatar'), { ...(getCurrentProfile() || activeUser || {}), avatar: pendingAvatar });
      showToast('Фото подготовлено. Нажмите «Сохранить изменения», чтобы применить его.');
    };
    image.onerror = () => showToast('Файл не удалось открыть как изображение.');
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});
document.getElementById('signOutButton').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBERED_SESSION_KEY);
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  pendingAvatar = null;
  showAuth('');
});

setupDashboardLayout();
const storedTransitions = localStorage.getItem(TRANSITIONS_KEY) !== 'false';
setTransitionsEnabled(storedTransitions);
const initialRoute = localStorage.getItem(ROUTE_KEY) || 'global';
document.querySelectorAll('[data-route]').forEach(item => item.classList.toggle('selected', item.dataset.route === initialRoute));
const storedTogglesValue = safeParse(localStorage.getItem(DEMO_TOGGLES_KEY), { proxy: true, tun: true });
const storedToggles = storedTogglesValue && typeof storedTogglesValue === 'object' ? storedTogglesValue : { proxy: true, tun: true };
setDemoToggle('proxy', storedToggles.proxy !== false);
setDemoToggle('tun', storedToggles.tun !== false);
syncHideIpToggles();
renderThemes();
const sessionEmail = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(REMEMBERED_SESSION_KEY);
const savedProfile = getCurrentProfile();
const sessionAccount = getAccounts().find(account => account.email === String(sessionEmail || '').toLowerCase());
if (sessionEmail && savedProfile && savedProfile.email === sessionEmail && sessionAccount) showApp({ ...sessionAccount.profile, ...savedProfile, role: sessionAccount.role });
else showAuth();
document.getElementById('appVersionLabel').textContent = APP_VERSION;

if (window.windowControls) {
  window.windowControls.onUpdateStatus(status => {
    const updateStatus = document.getElementById('updateSourceStatus');
    if (updateStatus) updateStatus.textContent = status;
  });
  const maxButton = document.getElementById('maximizeWindow');
  const setMaximized = state => {
    maxButton.classList.toggle('maximized', state);
    maxButton.setAttribute('aria-label', state ? 'Восстановить окно' : 'Развернуть окно');
    maxButton.title = state ? 'Восстановить' : 'Развернуть';
  };
  window.windowControls.isMaximized().then(setMaximized);
  window.windowControls.onMaximized(setMaximized);
  document.getElementById('minimizeWindow').addEventListener('click', () => window.windowControls.minimize());
  maxButton.addEventListener('click', () => window.windowControls.toggleMaximize());
  document.getElementById('closeWindow').addEventListener('click', () => window.windowControls.close());
} else {
  ['minimizeWindow', 'maximizeWindow', 'closeWindow'].forEach(id => document.getElementById(id).addEventListener('click', () => showToast('Управление окном доступно в версии EXE.')));
}

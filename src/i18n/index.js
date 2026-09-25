// Site-wide translation engine — hand-written dictionaries, no third-party
// service. English is the source language: every visible English string
// (text nodes + a few text attributes) is looked up in the active language's
// dictionary and swapped in place. A MutationObserver keeps whatever React
// renders later (route changes, modals, chatbot replies) translated too.
//
// Only text *content* is changed — React keeps owning the nodes, and form
// values/state stay English, so what reaches the backend never changes.
//
// Adding content: new English text simply shows in English until its entry
// is added to hi.json / fr.json / de.json / zh-CN.json (key = the English
// text with whitespace collapsed).

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'fr', label: 'French', nativeName: 'Français' },
  { code: 'de', label: 'German', nativeName: 'Deutsch' },
  { code: 'zh-CN', label: 'Chinese', nativeName: '中文' },
];

export const LANGUAGE_EVENT = 'dc:languagechange';

const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'dc.language';
const TRANSLATED_ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE', 'svg']);

const LOADERS = {
  hi: () => import('./hi.json'),
  fr: () => import('./fr.json'),
  de: () => import('./de.json'),
  'zh-CN': () => import('./zh-CN.json'),
};

// Google Fonts faces for scripts Inter/Playfair can't render.
const FONT_LINKS = {
  hi: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@500;600;700&display=swap',
  'zh-CN': 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;700&display=swap',
};

const supportedCodes = new Set(LANGUAGES.map((l) => l.code));
const dictCache = new Map();

let currentLang = DEFAULT_LANGUAGE;
let currentDict = null;
let observer = null;

// Per text node: the English source and the value we last wrote. If React
// later writes something else, that new value becomes the source.
const textState = new WeakMap();
// Per element: { [attr]: { src, applied } }
const attrState = new WeakMap();

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

// Dev-only coverage check: open any page with ?lang=fr&i18n-report and the
// English strings missing from that dictionary are listed on <html
// data-i18n-misses="[...]"> (readable from a headless-browser DOM dump).
const collectMisses =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('i18n-report');
const misses = new Set();

function recordMiss(key) {
  if (!/[A-Za-z]/.test(key) || misses.has(key)) return;
  misses.add(key);
  document.documentElement.dataset.i18nMisses = JSON.stringify([...misses]);
}

function lookup(source) {
  if (!currentDict) return source;
  const key = normalize(source);
  if (!key) return source;
  const hit = currentDict[key];
  if (hit === undefined) {
    if (collectMisses) recordMiss(key);
    return source;
  }
  // Keep the node's own leading/trailing spacing so inline text still flows.
  const lead = source.match(/^\s*/)[0];
  const trail = source.match(/\s*$/)[0];
  return lead + hit + trail;
}

function isSkipped(el) {
  for (let n = el; n && n.nodeType === 1; n = n.parentNode) {
    if (SKIP_TAGS.has(n.tagName)) return true;
    if (n.getAttribute('translate') === 'no' || n.classList.contains('notranslate')) return true;
  }
  return false;
}

function translateText(node) {
  const parent = node.parentNode;
  if (!parent || parent.nodeType !== 1 || isSkipped(parent)) return;

  let state = textState.get(node);
  if (!state || node.nodeValue !== state.applied) {
    state = { src: node.nodeValue, applied: node.nodeValue };
    textState.set(node, state);
  }
  const next = currentLang === DEFAULT_LANGUAGE ? state.src : lookup(state.src);
  if (next !== node.nodeValue) node.nodeValue = next;
  state.applied = next;
}

function translateAttr(el, attr) {
  const value = el.getAttribute(attr);
  if (value === null) return;

  let states = attrState.get(el);
  if (!states) {
    states = {};
    attrState.set(el, states);
  }
  let state = states[attr];
  if (!state || value !== state.applied) {
    state = { src: value, applied: value };
    states[attr] = state;
  }
  const next = currentLang === DEFAULT_LANGUAGE ? state.src : lookup(state.src);
  if (next !== value) el.setAttribute(attr, next);
  state.applied = next;
}

function translateElementAttrs(el) {
  if (isSkipped(el)) return;
  for (const attr of TRANSLATED_ATTRS) {
    if (el.hasAttribute(attr)) translateAttr(el, attr);
  }
}

function translateTree(root) {
  if (root.nodeType === 3) {
    translateText(root);
    return;
  }
  if (root.nodeType !== 1) return;
  if (isSkipped(root)) return;

  translateElementAttrs(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (n.nodeType === 1) {
        if (SKIP_TAGS.has(n.tagName) || n.getAttribute('translate') === 'no' || n.classList.contains('notranslate')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
      return /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === 3) translateText(n);
    else translateElementAttrs(n);
  }
}

function startObserver() {
  if (observer) return;
  // Runs as a microtask right after React commits, before the browser
  // paints — so new content never flashes in English.
  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(translateTree);
      } else if (m.type === 'characterData') {
        translateText(m.target);
      } else if (m.type === 'attributes') {
        if (!isSkipped(m.target)) translateAttr(m.target, m.attributeName);
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: TRANSLATED_ATTRS,
  });
}

function readStorage() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(code) {
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Storage blocked — the choice just won't survive a reload.
  }
}

function ensureFont(code) {
  const href = FONT_LINKS[code];
  if (!href || document.querySelector(`link[data-i18n-font="${code}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.i18nFont = code;
  document.head.appendChild(link);
}

function loadDict(code) {
  if (code === DEFAULT_LANGUAGE) return Promise.resolve(null);
  if (!dictCache.has(code)) {
    const p = LOADERS[code]()
      .then((m) => m.default)
      .catch((err) => {
        dictCache.delete(code); // allow a retry
        throw err;
      });
    dictCache.set(code, p);
  }
  return dictCache.get(code);
}

// Called when the dropdown opens, so a click right after is instant.
export function prefetchLanguages() {
  LANGUAGES.forEach((l) => {
    loadDict(l.code).catch(() => {});
  });
}

export function getLanguage() {
  return currentLang;
}

// Direct lookup for text the DOM pass can't handle on its own — e.g. a
// typewriter effect that renders a phrase one letter at a time. Render
// such text inside translate="no" and pass the full phrase through t().
export function t(text) {
  if (currentLang === DEFAULT_LANGUAGE || !currentDict) return text;
  const hit = currentDict[normalize(text)];
  return hit === undefined ? text : hit;
}

function getInitialLanguage() {
  // ?lang=hi in the URL wins over the saved choice — handy for sharing links.
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (supportedCodes.has(requested)) return requested;
  const saved = readStorage();
  return supportedCodes.has(saved) ? saved : DEFAULT_LANGUAGE;
}

export async function setLanguage(code) {
  const lang = supportedCodes.has(code) ? code : DEFAULT_LANGUAGE;
  let dict = null;
  try {
    dict = await loadDict(lang);
  } catch {
    return currentLang; // dictionary failed to load — stay where we are
  }

  currentLang = lang;
  currentDict = dict;
  writeStorage(lang);
  document.documentElement.lang = lang;
  ensureFont(lang);
  translateTree(document.body);
  window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: { code: lang } }));
  return lang;
}

// Resolves once the saved language's dictionary is ready, so the first
// React render is already translated (English resolves immediately).
export async function initI18n() {
  startObserver();
  const lang = getInitialLanguage();
  if (lang !== DEFAULT_LANGUAGE) await setLanguage(lang);
}

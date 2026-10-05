import {
  LETTERS, GROUPS, SYSTEMS, DEFAULT_OPTIONS, analyze, tokenize, normalize, isLetter, digitalRoot,
} from './ebced.js?v=1';

const $ = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('tr-TR');
const n = (v) => fmt.format(v);

const SAMPLES = {
  besmele: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  tevhid: 'لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ',
  ihlas: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
  fetih: 'بَلْدَةٌ طَيِّبَةٌ',
};
const NAMES = Object.fromEntries(LETTERS.map(([ch, , name]) => [ch, name]));
const ORDER = Object.fromEntries(LETTERS.map(([ch], i) => [ch, i]));

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* gizli pencere vb. */ }
  },
};

const state = {
  text: '',
  opt: { ...DEFAULT_OPTIONS, ...store.get('ebced:opt', {}) },
  selection: null, // { text, from: 'reader' | 'input' | 'word' }
  marked: null, // vurgulanan kelimenin iskeleti
};

const el = {
  text: $('text'), reader: $('reader'), readerEmpty: $('reader-empty'),
  total: $('total'), totalSys: $('total-sys'), systems: $('systems'),
  stLetters: $('st-letters'), stWords: $('st-words'), stRoot: $('st-root'),
  selEmpty: $('sel-empty'), selBody: $('sel-body'), selText: $('sel-text'), selTotal: $('sel-total'),
  selMeta: $('sel-meta'), selBreakdown: $('sel-breakdown'), selClear: $('btn-sel-clear'),
  words: $('words'), wordsMeta: $('words-meta'), wordSort: $('word-sort'),
  letters: $('letters'), lettersCount: $('letters-count'), lettersTotal: $('letters-total'),
  unknown: $('unknown-note'), kbd: $('kbd'), pop: $('pop'), badge: $('badge'), toast: $('toast'),
  optSummary: $('opt-summary'),
};

/** Kelimenin harekesiz iskeleti: aynı kelimenin harekeli/harekesiz yazımları bir arada sayılır. */
const skeleton = (w) => [...normalize(w)].filter(isLetter).join('');

// ---------------------------------------------------------------- hesap ve çizim

function render({ textChanged = false } = {}) {
  const { opt } = state;
  const res = analyze(state.text, opt);
  const tokens = tokenize(state.text);
  const words = tokens.filter((t) => t.word);

  el.total.textContent = n(res.total);
  el.totalSys.textContent = SYSTEMS[opt.system].name;
  el.stLetters.textContent = n(res.letters.length);
  el.stWords.textContent = n(words.length);
  el.stRoot.textContent = res.total ? digitalRoot(res.total) : 0;

  el.systems.replaceChildren(...Object.entries(SYSTEMS).map(([key, sys]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sys';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(key === opt.system));
    b.title = sys.note;
    b.dataset.sys = key;
    b.innerHTML = `<span>${sys.short}</span><b>${n(analyze(state.text, { ...opt, system: key }).total)}</b>`;
    return b;
  }));

  el.unknown.hidden = !res.unknown;
  if (res.unknown) {
    el.unknown.className = 'note warn';
    el.unknown.textContent = `Arap harfi olmayan ${n(res.unknown)} karakter (Latin harfi, rakam vb.) hesaba katılmadı.`;
  }

  if (textChanged) renderReader(tokens);
  renderWords(words);
  renderLetters(res);
  renderSelection();
  renderOptSummary();
}

function renderReader(tokens) {
  const frag = document.createDocumentFragment();
  for (const t of tokens) {
    if (!t.word) {
      frag.append(t.text);
      continue;
    }
    const s = document.createElement('span');
    s.className = 'w';
    s.dataset.k = skeleton(t.text);
    s.textContent = t.text;
    frag.append(s);
  }
  el.reader.replaceChildren(frag);
  el.readerEmpty.hidden = tokens.some((t) => t.word);
  applyMark();
}

function renderWords(words) {
  const map = new Map();
  words.forEach((w, i) => {
    const k = skeleton(w.text);
    const cur = map.get(k);
    if (cur) cur.count++;
    else map.set(k, { k, text: w.text, first: i, count: 1, value: analyze(w.text, state.opt).total });
  });
  let list = [...map.values()];
  const sort = el.wordSort.value;
  if (sort === 'value') list.sort((a, b) => b.value - a.value || a.first - b.first);
  if (sort === 'count') list.sort((a, b) => b.count - a.count || a.first - b.first);

  el.wordsMeta.textContent = words.length
    ? `${n(words.length)} kelime, ${n(list.length)} farklı. Bir kelimeye tıklayınca metindeki yerleri işaretlenir.`
    : 'Metin girildiğinde kelimeler burada listelenir.';
  el.words.replaceChildren(...list.map((w) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'wd';
    b.dataset.k = w.k;
    b.setAttribute('aria-pressed', String(state.marked === w.k));
    b.innerHTML = `<b lang="ar"></b><span>${n(w.value)}</span>${w.count > 1 ? `<i>×${w.count}</i>` : ''}`;
    b.querySelector('b').textContent = w.text;
    return b;
  }));
}

function renderLetters(res) {
  const agg = new Map();
  for (const l of res.letters) {
    const a = agg.get(l.base) ?? { base: l.base, value: l.value, count: 0 };
    a.count++;
    agg.set(l.base, a);
  }
  const rows = [...agg.values()].sort((a, b) => ORDER[a.base] - ORDER[b.base]);
  el.letters.replaceChildren(...rows.map((r) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td lang="ar">${r.base}</td><td>${NAMES[r.base]}</td><td class="num">${n(r.value)}</td>`
      + `<td class="num">${n(r.count)}</td><td class="num">${n(r.value * r.count)}</td>`;
    return tr;
  }));
  el.lettersCount.textContent = n(res.letters.length);
  el.lettersTotal.textContent = n(res.total);
}

function renderSelection() {
  const sel = state.selection;
  const has = Boolean(sel && sel.text.trim());
  el.selEmpty.hidden = has;
  el.selBody.hidden = !has;
  el.selClear.hidden = !has;
  if (!has) return;

  const res = analyze(sel.text, state.opt);
  const wordCount = tokenize(sel.text).filter((t) => t.word).length;
  el.selText.textContent = sel.text.trim();
  el.selTotal.textContent = n(res.total);
  const from = { reader: 'okuma alanından', input: 'metin kutusundan', word: 'tek kelime' }[sel.from] ?? '';
  el.selMeta.textContent = `${n(res.letters.length)} harf · ${n(wordCount)} kelime${from ? ` · ${from}` : ''}`;

  // Harf harf döküm; kelime araları boşlukla gösterilir.
  const LIMIT = 240;
  const chips = [];
  const chars = [...normalize(sel.text)];
  let prevIndex = -1;
  for (const l of res.letters.slice(0, LIMIT)) {
    if (prevIndex >= 0 && chars.slice(prevIndex + 1, l.index).some((c) => /\s|[^\p{L}\p{M}ـ]/u.test(c))) {
      chips.push(Object.assign(document.createElement('span'), { className: 'lt sp' }));
    }
    prevIndex = l.index;
    const c = document.createElement('span');
    c.className = 'lt';
    c.innerHTML = `<b lang="ar"></b><small>${n(l.value)}</small>`;
    c.querySelector('b').textContent = l.ch;
    chips.push(c);
  }
  if (res.letters.length > LIMIT) {
    chips.push(Object.assign(document.createElement('span'), {
      className: 'more', textContent: `… ve ${n(res.letters.length - LIMIT)} harf daha`,
    }));
  }
  el.selBreakdown.replaceChildren(...chips);
}

function renderOptSummary() {
  const changed = Object.keys(DEFAULT_OPTIONS).filter((k) => k !== 'system' && state.opt[k] !== DEFAULT_OPTIONS[k]).length;
  el.optSummary.textContent = changed ? `${changed} ayar değişti` : 'varsayılan';
  for (const s of document.querySelectorAll('[data-opt]')) s.value = String(state.opt[s.dataset.opt]);
}

function applyMark() {
  for (const s of el.reader.querySelectorAll('.w')) s.classList.toggle('mark-on', s.dataset.k === state.marked);
}

// ---------------------------------------------------------------- metin

function fitTextarea() {
  el.text.style.height = 'auto';
  el.text.style.height = `${el.text.scrollHeight + 2}px`;
}

let saveTimer;
function setText(text, { fromInput = false } = {}) {
  state.text = text;
  if (!fromInput) el.text.value = text;
  fitTextarea();
  state.selection = null;
  state.marked = null;
  hideBadge();
  render({ textChanged: true });
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => store.set('ebced:text', state.text), 300);
}

el.text.addEventListener('input', () => setText(el.text.value, { fromInput: true }));

for (const b of document.querySelectorAll('[data-sample]')) {
  b.addEventListener('click', () => setText(SAMPLES[b.dataset.sample]));
}
$('btn-clear').addEventListener('click', () => {
  setText('');
  history.replaceState(null, '', location.pathname + location.search);
});
$('btn-share').addEventListener('click', async () => {
  if (!state.text.trim()) return toast('Önce bir metin girin.');
  const url = `${location.origin}${location.pathname}#t=${encodeURIComponent(state.text)}`;
  history.replaceState(null, '', url);
  try {
    await navigator.clipboard.writeText(url);
    toast('Bağlantı kopyalandı.');
  } catch {
    toast('Bağlantı adres çubuğunda; oradan kopyalayabilirsiniz.');
  }
});

function textFromHash() {
  const m = location.hash.match(/^#t=(.*)$/s);
  if (!m) return null;
  try { return decodeURIComponent(m[1]); } catch { return null; }
}
window.addEventListener('hashchange', () => {
  const t = textFromHash();
  if (t !== null) setText(t);
});

// ---------------------------------------------------------------- ayarlar ve sistem

el.systems.addEventListener('click', (e) => {
  const b = e.target.closest('[data-sys]');
  if (!b) return;
  setOpt({ system: b.dataset.sys });
});
for (const s of document.querySelectorAll('[data-opt]')) {
  s.addEventListener('change', () => {
    const v = s.value;
    setOpt({ [s.dataset.opt]: /^\d+$/.test(v) ? Number(v) : v });
  });
}
$('btn-reset').addEventListener('click', () => setOpt({ ...DEFAULT_OPTIONS, system: state.opt.system }));

function setOpt(patch) {
  state.opt = { ...state.opt, ...patch };
  store.set('ebced:opt', state.opt);
  render();
  repositionBadge();
}

el.wordSort.addEventListener('change', () => render());

// ---------------------------------------------------------------- kelime üzerine gelme

function wordPop(word) {
  const res = analyze(word, state.opt);
  el.pop.innerHTML = '<span class="ar" lang="ar"></span><span class="v"></span>';
  el.pop.querySelector('.ar').textContent = word;
  el.pop.querySelector('.v').textContent = `= ${n(res.total)}`;
  if (res.letters.length > 1 && res.letters.length <= 16) {
    const bd = document.createElement('span');
    bd.className = 'bd';
    for (const l of res.letters) {
      const c = document.createElement('span');
      c.innerHTML = `<b lang="ar"></b><small>${n(l.value)}</small>`;
      c.querySelector('b').textContent = l.ch;
      bd.append(c);
    }
    el.pop.append(bd);
  }
}

function showPop(span) {
  wordPop(span.textContent);
  el.pop.hidden = false;
  const r = span.getBoundingClientRect();
  const p = el.pop.getBoundingClientRect();
  let top = r.top - p.height - 6;
  if (top < 6) top = r.bottom + 6;
  const left = Math.min(Math.max(6, r.left + r.width / 2 - p.width / 2), innerWidth - p.width - 6);
  el.pop.style.top = `${top}px`;
  el.pop.style.left = `${left}px`;
}
const hidePop = () => { el.pop.hidden = true; };

let pointerDown = false;
el.reader.addEventListener('pointerdown', () => { pointerDown = true; hidePop(); });
addEventListener('pointerup', () => { pointerDown = false; });
el.reader.addEventListener('mouseover', (e) => {
  const w = e.target.closest('.w');
  if (w && !pointerDown && !selectionInReader()) showPop(w);
});
el.reader.addEventListener('mouseout', (e) => {
  if (!e.relatedTarget || !e.relatedTarget.closest?.('.w') || e.relatedTarget.closest('.w') !== e.target.closest('.w')) hidePop();
});
el.reader.addEventListener('scroll', () => { hidePop(); repositionBadge(); }, { passive: true });

// Tıklama (sürükleme olmadan): o kelimeyi seçim kartına al.
el.reader.addEventListener('click', (e) => {
  const w = e.target.closest('.w');
  if (!w || selectionInReader()) return;
  state.selection = { text: w.textContent, from: 'word' };
  renderSelection();
  if (matchMedia('(hover: none)').matches) {
    showPop(w);
    clearTimeout(showPop.t);
    showPop.t = setTimeout(hidePop, 2500);
  }
});

// ---------------------------------------------------------------- fareyle seçim

/** Belge seçiminin okuma alanına düşen kısmı (yoksa null). */
function readerRange() {
  const sel = getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const r = sel.getRangeAt(0).cloneRange();
  if (!r.intersectsNode(el.reader)) return null;
  const all = document.createRange();
  all.selectNodeContents(el.reader);
  if (r.compareBoundaryPoints(Range.START_TO_START, all) < 0) r.setStart(all.startContainer, all.startOffset);
  if (r.compareBoundaryPoints(Range.END_TO_END, all) > 0) r.setEnd(all.endContainer, all.endOffset);
  return r.toString() ? r : null;
}
const selectionInReader = () => Boolean(readerRange());

function onSelectionChange() {
  // Metin kutusundaki seçim (belge seçimi orada görünmez).
  if (document.activeElement === el.text) {
    const { selectionStart: a, selectionEnd: b } = el.text;
    if (a !== b) {
      const text = el.text.value.slice(a, b);
      if (state.selection?.text !== text || state.selection.from !== 'input') {
        state.selection = { text, from: 'input' };
        renderSelection();
      }
    }
    hideBadge();
    return;
  }
  const r = readerRange();
  if (!r) return hideBadge();
  hidePop();
  const text = r.toString();
  if (state.selection?.text !== text || state.selection.from !== 'reader') {
    state.selection = { text, from: 'reader' };
    renderSelection();
  }
  placeBadge(r);
}

let selFrame = 0;
document.addEventListener('selectionchange', () => {
  cancelAnimationFrame(selFrame);
  selFrame = requestAnimationFrame(onSelectionChange);
});
for (const ev of ['select', 'keyup', 'mouseup']) el.text.addEventListener(ev, onSelectionChange);

function placeBadge(r) {
  const res = analyze(r.toString(), state.opt);
  if (!res.letters.length) return hideBadge();
  el.badge.textContent = n(res.total);
  const rects = [...r.getClientRects()].filter((x) => x.width && x.height);
  const box = r.getBoundingClientRect();
  const first = rects[0] ?? box;
  const readerBox = el.reader.getBoundingClientRect();
  let top = Math.max(first.top, readerBox.top) - 8;
  let left = Math.min(Math.max(box.left + box.width / 2, 40), innerWidth - 40);
  if (top < 40) top = Math.min(box.bottom, readerBox.bottom) + 40;
  el.badge.style.top = `${top}px`;
  el.badge.style.left = `${left}px`;
  el.badge.hidden = false;
}
function repositionBadge() {
  if (el.badge.hidden) return;
  const r = readerRange();
  if (r) placeBadge(r);
  else hideBadge();
}
function hideBadge() { el.badge.hidden = true; }
addEventListener('scroll', repositionBadge, { passive: true });
addEventListener('resize', repositionBadge);

el.selClear.addEventListener('click', () => {
  state.selection = null;
  getSelection()?.removeAllRanges();
  hideBadge();
  renderSelection();
});

// ---------------------------------------------------------------- kelime listesi

el.words.addEventListener('click', (e) => {
  const b = e.target.closest('.wd');
  if (!b) return;
  state.marked = state.marked === b.dataset.k ? null : b.dataset.k;
  for (const x of el.words.querySelectorAll('.wd')) x.setAttribute('aria-pressed', String(x.dataset.k === state.marked));
  applyMark();
  if (state.marked) {
    state.selection = { text: b.querySelector('b').textContent, from: 'word' };
    renderSelection();
    el.reader.querySelector('.mark-on')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
});

// ---------------------------------------------------------------- sekmeler

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus) {
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    $(t.getAttribute('aria-controls')).hidden = !on;
  }
  if (focus) tab.focus();
  store.set('ebced:tab', tab.id);
}
for (const t of tabs) {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(t);
    if (e.key === 'ArrowRight') selectTab(tabs[(i + 1) % tabs.length], true);
    if (e.key === 'ArrowLeft') selectTab(tabs[(i - 1 + tabs.length) % tabs.length], true);
  });
}

// ---------------------------------------------------------------- ebced cetveli

$('groups').replaceChildren(...GROUPS.map(([name, word]) => {
  const d = document.createElement('div');
  d.className = 'group';
  const sum = [...word].reduce((s, ch) => s + LETTERS[ORDER[ch]][1], 0);
  d.innerHTML = `<h3>${name} <span lang="ar">${word}</span></h3><ul>${[...word].map((ch) => {
    const [, v, nm] = LETTERS[ORDER[ch]];
    return `<li title="${nm}"><b lang="ar">${ch}</b><small>${n(v)}</small></li>`;
  }).join('')}</ul>`;
  d.title = `${name}: toplam ${n(sum)}`;
  return d;
}));

// ---------------------------------------------------------------- harf klavyesi

const EXTRA = [['ة', 'tâ-i merbûta'], ['ء', 'hemze'], ['أ', 'elif hemze'], ['إ', 'elif hemze'], ['آ', 'medli elif'],
  ['ى', 'elif-i maksûre'], ['ؤ', 'hemzeli vav'], ['ئ', 'hemzeli ye']];
el.kbd.replaceChildren(
  ...LETTERS.map(([ch, v, name]) => key(ch, n(v), name)),
  ...EXTRA.map(([ch, name]) => key(ch, '', name, 'extra')),
  key(' ', 'boşluk', 'Boşluk', 'wide', 'boşluk'),
  key('\b', '⌫ sil', 'Sil', 'wide', '⌫ sil'),
);
function key(ch, sub, title, cls = '', label) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `key ${cls}`.trim();
  b.title = title;
  b.dataset.ch = ch;
  if (label) b.textContent = label;
  else b.innerHTML = `<b lang="ar">${ch}</b>${sub ? `<small>${sub}</small>` : ''}`;
  return b;
}
el.kbd.addEventListener('mousedown', (e) => e.preventDefault()); // imleç metin kutusunda kalsın
el.kbd.addEventListener('click', (e) => {
  const b = e.target.closest('.key');
  if (!b) return;
  const t = el.text;
  let { selectionStart: a, selectionEnd: z } = t;
  if (b.dataset.ch === '\b') {
    if (a === z) {
      const before = [...t.value.slice(0, a)];
      before.pop();
      a = before.join('').length;
    }
    t.setRangeText('', a, z, 'end');
  } else {
    t.setRangeText(b.dataset.ch, a, z, 'end');
  }
  setText(t.value, { fromInput: true });
});
$('btn-kbd').addEventListener('click', (e) => {
  const open = el.kbd.hidden;
  el.kbd.hidden = !open;
  e.currentTarget.setAttribute('aria-expanded', String(open));
  store.set('ebced:kbd', open);
});

// ---------------------------------------------------------------- bildirim

function toast(msg) {
  el.toast.textContent = msg;
  el.toast.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.toast.hidden = true; }, 2200);
}

// ---------------------------------------------------------------- başlangıç

if (store.get('ebced:kbd', false)) $('btn-kbd').click();
const savedTab = tabs.find((t) => t.id === store.get('ebced:tab', ''));
if (savedTab) selectTab(savedTab);
setText(textFromHash() ?? store.get('ebced:text', SAMPLES.besmele));

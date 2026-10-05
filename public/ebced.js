// Ebced hesabı: Arap harflerinin sayı değerleri ve metin çözümlemesi.
// Tarayıcıda ve Node'da (testler) aynı modül kullanılır; DOM'a dokunmaz.

/** Ebced sırasıyla 28 harf: [harf, değer (Meşrık), Türkçe adı]. */
export const LETTERS = [
  ['ا', 1, 'elif'], ['ب', 2, 'be'], ['ج', 3, 'cim'], ['د', 4, 'dal'],
  ['ه', 5, 'he'], ['و', 6, 'vav'], ['ز', 7, 'ze'], ['ح', 8, 'ha'],
  ['ط', 9, 'tı'], ['ي', 10, 'ye'], ['ك', 20, 'kef'], ['ل', 30, 'lam'],
  ['م', 40, 'mim'], ['ن', 50, 'nun'], ['س', 60, 'sin'], ['ع', 70, 'ayın'],
  ['ف', 80, 'fe'], ['ص', 90, 'sad'], ['ق', 100, 'kaf'], ['ر', 200, 'rı'],
  ['ش', 300, 'şın'], ['ت', 400, 'te'], ['ث', 500, 'se'], ['خ', 600, 'hı'],
  ['ذ', 700, 'zel'], ['ض', 800, 'dad'], ['ظ', 900, 'zı'], ['غ', 1000, 'ğayın'],
];

/** Ebced kelimeleri (harf grupları): ebced, hevvez, huttî, kelemen, sa'fes, karaşet, sehaz, dazağ. */
export const GROUPS = [
  ['ebced', 'ابجد'], ['hevvez', 'هوز'], ['huttî', 'حطي'], ['kelemen', 'كلمن'],
  ['sa‘fes', 'سعفص'], ['karaşet', 'قرشت'], ['sehaz', 'ثخذ'], ['dazağ', 'ضظغ'],
];

const MASHRIQ = Object.fromEntries(LETTERS.map(([ch, v]) => [ch, v]));
// Mağrib (Kuzey Afrika) sıralamasında altı harfin değeri farklıdır.
const MAGHRIB = { ...MASHRIQ, 'ص': 60, 'ض': 90, 'س': 300, 'ظ': 800, 'غ': 900, 'ش': 1000 };

export const SYSTEMS = {
  kebir: { name: 'Cümel-i kebîr', short: 'Kebîr', table: MASHRIQ, note: 'Standart (Meşrık) değerler' },
  magrib: { name: 'Mağribî', short: 'Mağribî', table: MAGHRIB, note: 'Kuzey Afrika sıralaması' },
  sagir: { name: 'Cümel-i sağîr', short: 'Sağîr', table: MASHRIQ, mod: 12, note: 'Değerin 12’ye bölümünden kalan' },
};

export const DEFAULT_OPTIONS = {
  system: 'kebir',
  taMarbuta: 400, // ة: açık te gibi (TDV) ya da he gibi 5
  hamza: 1, // tek başına ء: elif gibi 1 ya da 0
  hamzaSeat: 'alif', // ؤ ئ: elif gibi 1 (TDV: "kürsüsü ne olursa olsun elif") ya da taşıyıcı harf (6/10)
  madda: 1, // آ: tek elif 1 ya da iki elif 2
  shadda: 'once', // şeddeli harf: bir kez ya da iki kez
};

// Harf varyantları → temel harf. Değeri seçeneğe bağlı olanlar (ة ء ؤ ئ آ) ayrıca ele alınır.
const VARIANTS = {
  'أ': 'ا', 'إ': 'ا', 'ٱ': 'ا', 'ٲ': 'ا', 'ٳ': 'ا', 'ٵ': 'ا',
  'ى': 'ي', 'ی': 'ي', 'ې': 'ي', 'ۍ': 'ي', 'ێ': 'ي', 'ے': 'ي', 'ۓ': 'ي',
  'ک': 'ك', 'گ': 'ك', 'ڭ': 'ك', 'ڪ': 'ك', 'ګ': 'ك', 'ڳ': 'ك',
  'پ': 'ب', 'چ': 'ج', 'ژ': 'ز', 'ڤ': 'ف', 'ڨ': 'ق',
  'ە': 'ه', 'ہ': 'ه', 'ھ': 'ه', 'ۀ': 'ه', 'ۂ': 'ه',
  'ۆ': 'و', 'ۇ': 'و', 'ۈ': 'و', 'ۋ': 'و', 'ۉ': 'و', 'ۏ': 'و',
};
const SPECIAL = new Set(['ة', 'ۃ', 'ء', 'ؤ', 'ئ', 'ٶ', 'ٸ', 'آ']);

// Harekeler, tenvin, şedde, cezm, hançerî elif, Kur’an işaretleri, keşide ve ZWNJ/ZWJ sayılmaz (kelimenin parçasıdır).
const MARK_RE = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭ࣓-ࣿـ‌‍]/;
const SHADDA = 'ّ';

/** Karakter Arap harfi mi (değeri olsun olmasın)? */
export function isLetter(ch) {
  return ch in MASHRIQ || ch in VARIANTS || SPECIAL.has(ch);
}

/** Kelimenin parçası sayılan karakter: harf ya da harfe bağlı işaret. */
export function isWordChar(ch) {
  return isLetter(ch) || MARK_RE.test(ch);
}

/**
 * Bir karakteri sayılacak harf(ler)e çevirir: [[temel harf, gösterilecek harf], …].
 * Değeri olmayan karakter için boş dizi döner.
 */
function expand(ch, opt) {
  if (ch in MASHRIQ) return [[ch, ch]];
  if (ch in VARIANTS) return [[VARIANTS[ch], ch]];
  switch (ch) {
    case 'ة': case 'ۃ': return [[opt.taMarbuta === 5 ? 'ه' : 'ت', ch]];
    case 'ء': return opt.hamza ? [['ا', ch]] : [];
    case 'ؤ': case 'ٶ': return [[opt.hamzaSeat === 'alif' ? 'ا' : 'و', ch]];
    case 'ئ': case 'ٸ': return [[opt.hamzaSeat === 'alif' ? 'ا' : 'ي', ch]];
    case 'آ': return opt.madda === 2 ? [['ا', ch], ['ا', ch]] : [['ا', ch]];
    default: return [];
  }
}

/** Metni Unicode'a göre düzenler: sunum biçimleri (ﻻ, ﷲ …) temel harflere, ayrık hemze/med birleşik harfe. */
export function normalize(text) {
  return text.normalize('NFKC');
}

/** Tek harf değeri (seçili sisteme göre). */
export function letterValue(base, opt = DEFAULT_OPTIONS) {
  const sys = SYSTEMS[opt.system] ?? SYSTEMS.kebir;
  const v = sys.table[base] ?? 0;
  return sys.mod ? v % sys.mod : v;
}

/**
 * Metni çözümler.
 * @returns {{ total, letters: {ch, base, value}[], unknown: number }}
 *   letters: sayılan her harf sırasıyla; unknown: hesaba katılmayan Arap dışı harf/rakam sayısı.
 */
export function analyze(text, options = {}) {
  const opt = { ...DEFAULT_OPTIONS, ...options };
  const chars = [...normalize(text)];
  const letters = [];
  let unknown = 0;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === SHADDA) {
      // Şedde bir önceki harfi ikiler (seçeneğe bağlı).
      if (opt.shadda === 'twice' && letters.length && letters.at(-1).index === lastIndex(chars, i)) {
        const prev = letters.at(-1);
        letters.push({ ...prev, doubled: true });
      }
      continue;
    }
    const parts = expand(ch, opt);
    if (parts.length) {
      for (const [base, shown] of parts) letters.push({ ch: shown, base, value: letterValue(base, opt), index: i });
    } else if (/[\p{L}\p{N}]/u.test(ch) && !MARK_RE.test(ch) && !isLetter(ch)) {
      unknown++;
    }
  }
  const total = letters.reduce((s, l) => s + l.value, 0);
  return { total, letters, unknown };
}

// Şeddenin bağlı olduğu harfin konumu: aradaki harekeleri atlayarak geriye bakar.
function lastIndex(chars, i) {
  let j = i - 1;
  while (j >= 0 && MARK_RE.test(chars[j])) j--;
  return j;
}

/** Yalnız toplam. */
export function value(text, options) {
  return analyze(text, options).total;
}

/**
 * Metni kelimelere ve aradaki parçalara böler (okuma görünümü için).
 * @returns {{ text, word: boolean }[]}
 */
export function tokenize(text) {
  const out = [];
  let buf = '';
  let inWord = false;
  for (const ch of text) {
    const w = isWordChar(ch);
    if (buf && w !== inWord) {
      out.push({ text: buf, word: inWord });
      buf = '';
    }
    buf += ch;
    inWord = w;
  }
  if (buf) out.push({ text: buf, word: inWord });
  // Başında harf olmayan (yalnız işaretten oluşan) parçalar kelime sayılmaz.
  return out.map((t) => (t.word && ![...t.text].some(isLetter) ? { ...t, word: false } : t));
}

/** Sayı kökü: rakamları tek haneye inene kadar toplar. */
export function digitalRoot(n) {
  return n === 0 ? 0 : 1 + ((n - 1) % 9);
}

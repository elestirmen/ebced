// Latin harfiyle (Türkçe ya da akademik transkripsiyonla) yazılmış kelimeleri Arap harfine çevirir.
// Çeviri kesin değildir: önce sözlüğe bakılır, yoksa Osmanlıca yazım alışkanlıklarına göre tahmin edilir.

// "anahtar1,anahtar2=yazılış1|yazılış2". İlk yazılış önerilir, diğerleri seçenek olarak sunulur.
// ة ile biten yazılışların Osmanlıca ه'li hâli ayrıca seçenek olarak eklenir.
const DICT_SRC = `
ahmet,ahmed=احمد
mehmet,mehmed,muhammed,muhammet,muhammad=محمد
mustafa=مصطفى
ali=علي
hasan=حسن
hüseyin,hüseyn=حسين
ömer=عمر
osman=عثمان
ebubekir,ebubekr=ابوبكر
yusuf=يوسف
ibrahim=ابراهيم
ismail=اسماعيل
ishak=اسحاق
yakup,yakub=يعقوب
musa=موسى
isa=عيسى
davut,davud=داود
süleyman=سليمان
yunus=يونس
eyüp,eyüb,eyyüp,eyyub=ايوب
zekeriya,zekeriyya=زكريا
yahya=يحيى
adem=آدم
nuh=نوح
idris=ادريس
harun=هارون
hamza=حمزة
abdullah=عبدالله
abdurrahman=عبدالرحمن
abdurrahim=عبدالرحيم
abdülkadir,abdulkadir=عبدالقادر
abdülhamit,abdülhamid,abdulhamit=عبدالحميد
abdülaziz,abdulaziz=عبدالعزيز
abdülkerim,abdulkerim=عبدالكريم
abdülmecit,abdülmecid=عبدالمجيد
abdüsselam=عبدالسلام
abdülbaki=عبدالباقي
abdülvahap,abdulvahap,abdülvehhab=عبدالوهاب
halil=خليل
kemal=كمال
cemal=جمال
celal=جلال
bilal=بلال
salih=صالح
said,sait=سعيد
murat,murad=مراد
mahmut,mahmud=محمود
hamit,hamid=حامد|حميد
recep,receb=رجب
ramazan=رمضان
şaban=شعبان
hakan=خاقان
emre=امره
kerem=كرم
kerim=كريم
rahim=رحيم
rahman=رحمن
selim=سليم
selman,salman=سلمان
sami=سامي
semih=سميح
şakir=شاكر
şükrü=شكري
tahir=طاهر
tayyip,tayyib=طيب
tarık,tarik=طارق
yasin=ياسين
taha=طه
yasir,yaser=ياسر
zeki=ذكي
nazım=ناظم
naci=ناجي
necati=نجاتي
nurettin,nureddin=نورالدين
alaattin,alaeddin=علاءالدين
bahattin,bahaeddin=بهاءالدين
cemalettin,cemaleddin=جمالالدين
fahrettin,fahreddin=فخرالدين
hayrettin,hayreddin=خيرالدين
şemsettin,şemseddin=شمسالدين
sadettin,sadeddin=سعدالدين
burhanettin,burhaneddin=برهانالدين
necmettin,necmeddin=نجمالدين
hüsamettin,hüsameddin=حسامالدين
kemalettin,kemaleddin=كمالالدين
celalettin,celaleddin=جلالالدين
seyfettin,seyfeddin=سيفالدين
izzettin,izzeddin=عزالدين
sabahattin,sabahaddin=صباحالدين
ziya=ضياء|ضيا
burhan=برهان
ertuğrul,ertugrul=ارطغرل
tuğrul=طغرل
orhan=اورخان
oğuz=اوغوز
bayram=بايرام
arslan=ارسلان
aslan=اصلان|ارسلان
timur=تيمور
cengiz=چنگيز
fatih=فاتح
fevzi=فوزي
fuat,fuad=فؤاد
ferhat,ferhad=فرهاد
fikret=فكرت
hikmet=حكمت
rıfat,rifat=رفعت
nusret=نصرت
nimet=نعمت
kudret=قدرت
şevket=شوكت
saadet=سعادت
izzet=عزت
mithat,midhat=مدحت
cevdet=جودت
cevat,cevad=جواد
necdet=نجدت
nejat=نجات
reşat,reşad=رشاد
reşit,reşid=رشيد
vahit,vahid=واحد
vehbi=وهبي
hilmi=حلمي
hulusi=خلوصي
hamdi=حمدي
hayri=خيري
hakkı=حقي
lütfi=لطفي
rüştü=رشدي
sabri=صبري
sıtkı=صدقي
şevki=شوقي
tevfik=توفيق
vecdi=وجدي
zühtü=زهدي
ihsan=احسان
irfan=عرفان
iskender=اسكندر
kadir=قادر
kamil=كامل
latif=لطيف
mecit,mecid=مجيد
mesut,mesud=مسعود
metin=متين
muammer=معمر
muhsin=محسن
münir=منير
nail=نائل
nasır,nasir=ناصر
nazif=نظيف
nuri=نوري
rauf=رؤوف
refik=رفيق
rıza,riza=رضا
sabit=ثابت
sadık,sadik=صادق
safa,sefa=صفا
seyit,seyyid,seyid=سيد
sinan=سنان
suat,suad=سعاد
şerif=شريف
şemsi=شمسي
şahin=شاهين
talat=طلعت
veli=ولي
zafer=ظفر
zahit,zahid=زاهد
zübeyir,zübeyr=زبير
abbas=عباس
ammar=عمار
enes=انس
esat,esad=اسعد
emin=امين
ekrem=اكرم
eşref=اشرف
halit,halid=خالد
hakim=حكيم
habib,habip=حبيب
haydar=حيدر
hidayet=هدايت
hızır=خضر
ilyas=الياس
kasım=قاسم
lokman=لقمان
mansur=منصور
mehdi=مهدي
mevlana=مولانا
muharrem=محرم
nebi=نبي
necip,necib=نجيب
numan=نعمان
resul=رسول
talha=طلحة
umut=اميد
zeyd,zeyt=زيد
cafer=جعفر
cihan=جهان
cüneyt,cüneyd=جنيد
gazi=غازي
mümin=مؤمن
nurullah=نورالله
fethullah=فتحالله
hayrullah=خيرالله
lütfullah=لطفالله
ataullah=عطاءالله
fatma,fatıma,fatima,fadime=فاطمة
ayşe,aişe=عائشة
emine=امينة
hatice=خديجة
zeynep,zeyneb=زينب
meryem=مريم
elif=الف
zehra=زهراء|زهرا
esma=اسماء
rabia=رابعة
kübra=كبرى
büşra=بشرى
merve=مروة
havva=حواء
sümeyye=سمية
hacer=هاجر
rukiye,rukiyye=رقية
safiye=صفية
nur=نور
hilal=هلال
selma=سلمى
leyla=ليلى
asiye=آسية
belkıs=بلقيس
cemile=جميلة
emel=امل
esra=اسراء
feride=فريدة
gülsüm=كلثوم
habibe=حبيبة
halime=حليمة
hamide=حميدة
hayriye=خيرية
hediye=هدية
kadriye=قدرية
kevser=كوثر
latife=لطيفة
melek=ملك
melike=مليكة
münevver=منور
naciye=ناجية
naime=نعيمة
necla=نجلاء
nesrin=نسرين
nuriye=نورية
rahime=رحيمة
raziye=راضية
rümeysa=رميساء
sabiha=صبيحة
sadiye=سعدية
saliha=صالحة
sare,sara=سارة
semra=سمراء
serap=سراب
sevde=سودة
şerife=شريفة
şükran=شكران
tuba=طوبى
yasemin=ياسمين
zübeyde=زبيدة
zeliha,züleyha=زليخا
zekiye=زكية
bahar=بهار
gül=گل
reyhan=ريحان
hümeyra=حميراء
aliye=عالية
mukaddes=مقدس
nefise=نفيسة
nazife=نظيفة
hafsa=حفصة
sakine=سكينة
allah=الله
bismillah=بسمالله
peygamber=پيغمبر
kuran,kur'an=قرآن
islam=اسلام
iman=ايمان
namaz=نماز
oruç=اوروج
hac=حج
zekat=زكاة|زكات
dua=دعا|دعاء
hak,hakk=حق
aşk=عشق
ilim,ilm=علم
rahmet=رحمت
selam=سلام
cennet=جنت
cehennem=جهنم
kitap,kitab=كتاب
kalem=قلم
kalp,kalb=قلب
ruh=روح
can=جان
dünya=دنيا
ahiret=آخرت
hamd=حمد
elhamdülillah=الحمدلله
maşallah=ماشاءالله
inşallah=انشاءالله
sübhanallah,subhanallah=سبحانالله
ekber=اكبر
tevhid,tevhit=توحيد
vatan=وطن
millet=ملت
devlet=دولت
türk=ترك
türkiye=تركيه
osmanlı=عثمانلي
istanbul=استانبول|اسلامبول
ankara=آنقره
konya=قونيه
bursa=بروسه
edirne=ادرنه
mekke=مكه
medine=مدينه
kudüs=قدس
şam=شام
bağdat,bağdad=بغداد
kahire=قاهره
kabe=كعبه
kandil=قنديل
cuma=جمعه
ezan=اذان
cami=جامع
mescit,mescid=مسجد
sure=سوره
ayet=آيت
fatiha=فاتحه
ihlas=اخلاص
felak=فلق
nas=ناس
mevlit,mevlid=مولد
kelime=كلمه
tarih=تاريخ
ebced=ابجد
ve=و
ile=ايله
bir=بر
bu=بو
şu=شو
o=او
ki=كه
de,da=ده
için=ايچون
gibi=گبي
ben=بن
sen=سن
biz=بز
siz=سز
`;

/** Türkçe küçük harfe çevirip uzatma işaretlerini kaldırır (sözlük anahtarı). */
const lower = (s) => s.toLocaleLowerCase('tr-TR').normalize('NFC');
const plain = (s) => lower(s).replace(/[’'ʼ]/g, "'").replace(/[âā]/g, 'a').replace(/[îī]/g, 'i').replace(/[ûū]/g, 'u');
/** Türkçe karakterleri de katlar: "huseyin" → "hüseyin" ile aynı anahtar. */
const fold = (s) => plain(s).replace(/'/g, '').replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o')
  .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g');

const EXACT = new Map();
const FOLDED = new Map();
for (const line of DICT_SRC.split('\n')) {
  if (!line.includes('=')) continue;
  const [keys, vals] = line.split('=');
  const forms = vals.split('|');
  // Osmanlıca yazımda kelime sonundaki ة çoğu zaman ه yazılır.
  for (const f of [...forms]) if (f.endsWith('ة')) forms.push(`${f.slice(0, -1)}ه`);
  for (const k of keys.split(',')) {
    EXACT.set(plain(k).replace(/'/g, ''), forms);
    if (!FOLDED.has(fold(k))) FOLDED.set(fold(k), forms);
  }
}

function lookup(word) {
  return EXACT.get(plain(word).replace(/'/g, '')) ?? FOLDED.get(fold(word)) ?? null;
}

// ---------------------------------------------------------------- kurala dayalı tahmin

// Akademik transkripsiyon harfleri ve sabit karşılıklar (ünlü uyumuna bakılmaz).
const FIXED = {
  'ḥ': 'ح', 'ḫ': 'خ', 'ẖ': 'خ', 'ṣ': 'ص', 'ṭ': 'ط', 'ẓ': 'ظ', 'ż': 'ض', 'ḍ': 'ض', 'ṡ': 'ث', 'ṯ': 'ث',
  'ẕ': 'ذ', 'ḏ': 'ذ', 'ġ': 'غ', 'ḳ': 'ق', 'ñ': 'ڭ', 'ʿ': 'ع', 'ʾ': 'ء', "'": 'ع',
  b: 'ب', c: 'ج', ç: 'چ', d: 'د', f: 'ف', h: 'ه', j: 'ژ', l: 'ل', m: 'م', n: 'ن', p: 'پ', r: 'ر',
  s: 'س', ş: 'ش', t: 'ت', v: 'و', w: 'و', y: 'ي', z: 'ز', q: 'ق', x: 'كس',
};
const VOWELS = new Set([...'aeıioöuüâîûāīū']);
const BACK = new Set([...'aıouâûāū']);
const LONG = { 'â': 'ا', 'ā': 'ا', 'î': 'ي', 'ī': 'ي', 'û': 'و', 'ū': 'و' };

/** k/g/ğ için en yakın ünlü kalın mı (önce sonraki, yoksa önceki ünlüye bakılır)? */
function backAt(chars, i) {
  for (let j = i + 1; j < chars.length; j++) if (VOWELS.has(chars[j])) return BACK.has(chars[j]);
  for (let j = i - 1; j >= 0; j--) if (VOWELS.has(chars[j])) return BACK.has(chars[j]);
  return true;
}

// Akademik transkripsiyon (ḥasan, ʿömer, fāṭıma): kısa ünlüler yazılmaz, yalnız uzunlar (ā ī ū) yazılır.
const ACADEMIC_RE = /[ḥḫẖṣṭẓżḍṡṯẕḏġḳʿʾāīū]|s̱/u;

/**
 * Osmanlıca yazım alışkanlıklarıyla yaklaşık çeviri: başta ünlü elifle yazılır, içteki e/ı yazılmaz,
 * a/i/o/u harfle gösterilir, sonda a/e he olur; kalın ünlülü hecede k → ق, g/ğ → غ. Çift ünsüz tek yazılır.
 * @param cont kelimenin devamı mı (ek): öyleyse baştaki ünlü elif almaz.
 */
export function guess(word, { cont = false } = {}) {
  const academic = ACADEMIC_RE.test(lower(word));
  const chars = [...lower(word).replace(/s̱/g, 'ṯ').replace(/[’ʼ]/g, "'")].filter((c) => !/\p{M}/u.test(c));
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const first = i === 0 && !cont;
    const last = i === chars.length - 1;
    if (VOWELS.has(c) && academic) {
      out += first ? (LONG[c] && !'āâ'.includes(c) ? `ا${LONG[c]}` : 'ا') : (LONG[c] ?? '');
      continue;
    }
    if (VOWELS.has(c)) {
      if (first) out += 'iîī'.includes(c) ? 'اي' : 'oöuüûū'.includes(c) ? 'او' : 'ا';
      else if (LONG[c]) out += LONG[c];
      else if (last) out += 'ae'.includes(c) ? 'ه' : 'ıi'.includes(c) ? 'ي' : 'و';
      else out += c === 'a' ? 'ا' : c === 'i' ? 'ي' : 'eı'.includes(c) ? '' : 'و';
      continue;
    }
    if (c === chars[i - 1]) continue; // çift ünsüz: Arap yazısında tek harf (şedde)
    if (c === 'k') out += backAt(chars, i) ? 'ق' : 'ك';
    else if (c === 'g' || c === 'ğ') out += backAt(chars, i) ? 'غ' : 'گ';
    else out += FIXED[c] ?? '';
  }
  return out;
}

/**
 * Tek kelimeyi çevirir.
 * @returns {{ ar: string, alts: string[], source: 'sözlük' | 'sözlük + ek' | 'tahmin' }}
 */
export function transliterate(word) {
  const hit = lookup(word);
  if (hit) return { ar: hit[0], alts: hit, source: 'sözlük' };
  // "Ahmet'in": kök sözlükte, ek tahminle eklenir.
  const m = word.match(/^(.+?)[’'ʼ](\p{L}+)$/u);
  if (m) {
    const base = lookup(m[1]);
    if (base) {
      const suffix = guess(m[2], { cont: true });
      const alts = base.map((b) => b + suffix);
      return { ar: alts[0], alts, source: 'sözlük + ek' };
    }
  }
  return { ar: guess(word), alts: [], source: 'tahmin' };
}

// Latin harfiyle başlayan (ya da ʿ ʾ ile başlayan akademik) kelime; içinde kesme işareti olabilir.
const WORD_RE = /[\p{Script=Latin}ʿʾ][\p{Script=Latin}\p{M}ʿʾ]*(?:[’'ʼ][\p{Script=Latin}\p{M}ʿʾ]+)*/gu;

/** Değiştirme seçimleri için kelime anahtarı (büyük/küçük harf ve Türkçe karakter farkı gözetmez). */
export const keyOf = (word) => fold(word);

/**
 * Metindeki Latin harfli kelimeleri Arap harfli karşılıklarıyla değiştirir.
 * @param overrides { anahtar: yazılış } kullanıcının düzelttikleri
 * @returns {{ text: string, items: { key, latin, ar, suggestion, alts, source, count, edited }[] }}
 */
export function convertText(text, overrides = {}) {
  const items = new Map();
  const out = text.replace(WORD_RE, (w) => {
    const key = keyOf(w);
    let it = items.get(key);
    if (!it) {
      const t = transliterate(w);
      const edited = typeof overrides[key] === 'string';
      it = { key, latin: w, ar: edited ? overrides[key] : t.ar, suggestion: t.ar, alts: t.alts, source: t.source, count: 0, edited };
      items.set(key, it);
    }
    it.count++;
    return it.ar;
  });
  return { text: out, items: [...items.values()] };
}

/** Metinde Latin harfli kelime var mı? */
export const hasLatin = (text) => /[\p{Script=Latin}ʿʾ]/u.test(text);

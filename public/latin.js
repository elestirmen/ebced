// Latin harfiyle (Türkçe ya da akademik transkripsiyonla) yazılmış kelimeleri Arap harfine çevirir.
// Çeviri kesin değildir: önce sözlüğe bakılır, yoksa Osmanlıca yazım alışkanlıklarına göre tahmin edilir.

// Sözlük biçimi: "anahtar1,anahtar2=yazılış1|yazılış2". İlk yazılış önerilir, diğerleri seçenek olarak sunulur.
// İlk yazılış ة ile bitiyorsa (Arapça kökenli kadın adları vb.) Türkçe ebced geleneğine uyularak ه'li Osmanlıca
// biçim ilk öneri yapılır, Arapça biçim seçenek kalır (Fatma: فاطمه 135, فاطمة 530).
// Birleşik adlarda (Celâleddin, Fethullah) parçalar görünmez ayırıcıyla (U+200C) ayrılır: tek kelime sayılır,
// harfler yanlış bitişmez (ل+ا → لا bağı oluşmaz); ayırıcının değeri yoktur.
const DICT_SRC = `
# --- peygamber ve sahabe adları, Arapça erkek adları
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
lokman=لقمان
ilyas=الياس
hızır=خضر
mikail=ميكائيل
hamza=حمزة
abbas=عباس
ammar=عمار
talha=طلحة
zübeyir,zübeyr=زبير
enes=انس
bilal=بلال
halit,halid=خالد
cafer=جعفر
cüneyt,cüneyd=جنيد
zeyd=زيد
seyit,seyyid,seyid=سيد
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
abdülmelik,abdulmelik=عبدالملك
abdüssamet,abdussamed=عبدالصمد
halil=خليل
kemal=كمال
cemal=جمال
celal=جلال
salih=صالح
said,sait=سعيد
murat,murad=مراد
mahmut,mahmud=محمود
hamit,hamid=حامد|حميد
recep,receb=رجب
ramazan=رمضان
şaban=شعبان
muharrem=محرم
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
fatih=فاتح
fevzi=فوزي
fuat,fuad=فؤاد
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
sinan=سنان
suat,suad=سعاد
şerif=شريف
şemsi=شمسي
şahin=شاهين
talat=طلعت
veli=ولي
zafer=ظفر
zahit,zahid=زاهد
esat,esad=اسعد
emin=امين
ekrem=اكرم
eşref=اشرف
hakim=حكيم
habib,habip=حبيب
haydar=حيدر
hidayet=هدايت
kasım=قاسم
mansur=منصور
mehdi=مهدي
mevlana=مولانا
nebi=نبي
necip,necib=نجيب
numan=نعمان
resul=رسول
umut,ümit=اميد
cihan=جهان
gazi=غازي
mümin=مؤمن
adnan=عدنان
akif=عاكف
arif=عارف
asım=عاصم
baki=باقي
bedri=بدري
behçet=بهجت
bekir=بكر
berat=برات
cahit=جاهد
cavit=جاويد
cemil=جميل
cumhur=جمهور
enver=انور
faruk=فاروق
ferit=فريد
feyyaz=فياض
fikri=فكري
fikret=فكرت
galip=غالب
halis=خالص
hayati=حياتي
hüsnü=حسني
ilhami=الهامي
ismet=عصمت
kazım=كاظم
kenan=كنعان
macit=ماجد
mahir=ماهر
melih=مليح
memduh=ممدوح
muzaffer=مظفر
mücahit=مجاهد
müfit=مفيد
mevlüt,mevlüd=مولود
nabi=نابي
nadir=نادر
namık=نامق
necmi=نجمي
nedim=نديم
nezih=نزيه
nihat=نهاد
nizam=نظام
raşit=راشد
rasim=راسم
recai=رجائي
refet=رأفت
remzi=رمزي
rıdvan=رضوان
rıfkı=رفقي
saim=صائم
sedat=سداد
sefer=سفر
selami=سلامي
servet=ثروت
sezai=سزائي
süha=سها
şahap=شهاب
şems=شمس
şeref=شرف
tahsin=تحسين
talip=طالب
ufuk=افق
vedat=وداد
veysel=ويسل
zihni=ذهني
ziya=ضياء|ضيا
burhan=برهان
# --- -eddin / -ullah ile biten birleşik adlar
nurettin,nureddin=نور\u200cالدين
alaattin,alaeddin=علاء\u200cالدين
bahattin,bahaeddin=بهاء\u200cالدين
cemalettin,cemaleddin=جمال\u200cالدين
fahrettin,fahreddin=فخر\u200cالدين
hayrettin,hayreddin=خير\u200cالدين
şemsettin,şemseddin=شمس\u200cالدين
sadettin,sadeddin=سعد\u200cالدين
burhanettin,burhaneddin=برهان\u200cالدين
necmettin,necmeddin=نجم\u200cالدين
hüsamettin,hüsameddin=حسام\u200cالدين
kemalettin,kemaleddin=كمال\u200cالدين
celalettin,celaleddin=جلال\u200cالدين
seyfettin,seyfeddin=سيف\u200cالدين
izzettin,izzeddin=عز\u200cالدين
sabahattin,sabahaddin=صباح\u200cالدين
selahattin,selahaddin=صلاح\u200cالدين
muhittin,muhiddin,muhyiddin=محي\u200cالدين
nizamettin,nizameddin=نظام\u200cالدين
vahdettin,vahideddin,vahdeddin=وحيد\u200cالدين
ziyaettin,ziyaeddin=ضياء\u200cالدين
nurullah=نور\u200cالله
fethullah=فتح\u200cالله
hayrullah=خير\u200cالله
lütfullah=لطف\u200cالله
ataullah=عطاء\u200cالله
emrullah=امر\u200cالله
# --- Türkçe ve Farsça kökenli erkek adları, soyadlar (Osmanlıca yazım)
ertuğrul,ertugrul=ارطغرل
tuğrul=طغرل
orhan=اورخان
oğuz=اوغوز
oğuzhan=اوغوزخان
bayram=بايرام
arslan=ارسلان
aslan=اصلان|ارسلان
timur=تيمور
cengiz=چنگيز
hakan=خاقان
emre=امره
kerem=كرم
ferhat,ferhad=فرهاد
kaan=قاآن
cihangir=جهانگير
kamuran=كامران
nevzat=نوزاد
bülent=بلند
serdar=سردار
serhat=سرحد
ejder=اژدر
mete=مته
atilla,attila=آتيلا
alp=آلپ
alper=آلپر
aydın=آيدين
ayhan=آيخان
aykut=آيقوت
barış=باريش
batuhan=باتوخان
berk=برك
bora=بورا
bulut=بولوت
burak=براق
can=جان
cem=جم
coşkun=جوشقون
çağrı=چاغري
çelik=چليك
çetin=چتين
demir=دمير
deniz=دڭيز|دنيز
doğan=طوغان
dursun=طورسون
efe=افه
ekin=اكين
engin=انگين
ercan=ارجان
erdal=اردال
erdem=اردم
eren=ارن
erhan=ارخان
erkan=اركان
erol=ارول
ertan=ارتان
furkan=فرقان
gökçe=گوكچه
gökhan=گوكخان
güneş=گونش
gürkan=گوركان
ilhan=ايلخان
ilker=ايلكر
kara=قره
kaya=قايا
kılıç=قليج
koç=قوچ
kurt=قورد
kutlu=قوتلو
levent=لوند
oktay=اوقتاي
olcay=اولجاي
onur=اونور
ozan=اوزان
önder=اوندر
özcan=اوزجان
özdemir=اوزدمير
özer=اوزر
özgür=اوزگور
özkan=اوزقان
öztürk=اوزترك
polat=پولاد
selçuk=سلجوق
serkan=سركان
şimşek=شمشك
tamer=تامر
taner=تانر
tarkan=تارقان
tekin=تكين
tolga=طولغا
tuna=طونه
tuncay=طونجاي
turan=طوران
turgay=طورغاي
turgut=طورغود
turhan=طورخان
uğur=اوغور
ünal=اونال
volkan=ولقان
yalçın=يالچين
yaşar=ياشار
yavuz=ياووز
yiğit=يگيت
yıldırım=ييلديريم
yıldız=ييلديز
yılmaz=ييلماز
yücel=يوجل
yüksel=يوكسل
# --- kadın adları
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
sümeyra=سميرة
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
hümeyra=حميراء
aliye=عالية
mukaddes=مقدس
nefise=نفيسة
nazife=نظيفة
hafsa=حفصة
sakine=سكينة
beyza=بيضا|بيضاء
fikriye=فكرية
hanife=حنيفة
hamiyet=حميت
makbule=مقبولة
mediha=مديحة
mualla=معلا
muazzez=معزز
müberra=مبرا
mukadder=مقدر
münire=منيرة
nadide=ناديدة
nebahat=نباهت
nebile=نبيلة
nezahat=نزاهت
sabahat=صباحت
sabire=صابرة
saime=صائمة
selime=سليمة
semiha=سميحة
seniha=سنيحة
şaziye=شاذية
şükriye=شكرية
vesile=وسيلة
vildan=ولدان
zahide=زاهدة
ziynet=زينت
mevlüde=مولودة
# --- Türkçe ve Farsça kökenli kadın adları (Osmanlıca yazım)
bahar=بهار
gül=گل
reyhan=ريحان
nergis=نرگس
nigar=نگار
peri=پري
perihan=پريخان
mihriban=مهربان
mihrimah=مهرماه
neslihan=نسل\u200cخان
nilüfer=نيلوفر
nilgün=نيلگون
şebnem=شبنم
şirin=شيرين
şule=شعله
lale=لاله
canan=جانان
derya=دريا
handan=خندان
hande=خنده
hale=هاله
gamze=غمزه
gülay=گل\u200cآي
gülbahar=گلبهار
gülşen=گلشن
gülnur=گلنور
gülten=گلتن
ayşegül=عائشه\u200cگل
fatmagül=فاطمه\u200cگل
nurcan=نورجان
nurgül=نورگل
nuray=نوراي
nurten=نورتن
nurhan=نورخان
nuran=نوران
nermin=نرمين
nevin=نوين
nükhet=نكهت
aybüke=آيبوكه
ayla=آيلا
aylin=آيلين
aynur=آينور
aysel=آيسل
aysu=آيصو
aysun=آيسون
ayten=آيتن
bengü=بنگو
berna=برنا
buse=بوسه
ceren=جرن
ceyda=جيدا
çiğdem=چيكدم
defne=دفنه
dilek=ديلك
duygu=دويغو
ebru=ابرو
ece=اجه
esin=اسين
ezgi=ازگي
filiz=فيليز
gizem=گيزم
gönül=گوڭل
hülya=حوليا
ipek=ايپك
irem=ارم
kader=قدر
mine=مينه
nazlı=نازلي
özge=اوزگه
pelin=پلين
pınar=پيڭار
seda=صدا
sedef=صدف
selin=سلين
sema=سما
sevda=سودا
sevgi=سوگي
sevil=سويل
sevim=سويم
sevinç=سوينچ
sıla=صلا
simge=سيمگه
songül=صوڭگل
suna=صونا
türkan=توركان
tülay=تولاي
ülkü=اولكو
yağmur=ياغمور
yeliz=يليز
zuhal=زحل
# --- unvanlar, dinî ve günlük kelimeler
allah=الله
bismillah=بسم\u200cالله
elhamdülillah=الحمد\u200cلله
maşallah=ماشاء\u200cالله
inşallah=انشاء\u200cالله
sübhanallah,subhanallah=سبحان\u200cالله
peygamber=پيغمبر
kuran,kur'an=قرآن
islam=اسلام
iman=ايمان
namaz=نماز
oruç=اوروج
hac=حج
zekat=زكات|زكاة
dua=دعا|دعاء
hak,hakk=حق
aşk=عشق
ilim,ilm=علم
rahmet=رحمت|رحمة
selam=سلام
cennet=جنت|جنة
cehennem=جهنم
kitap,kitab=كتاب
kalem=قلم
kalp,kalb=قلب
ruh=روح
dünya=دنيا
ahiret=آخرت
hamd=حمد
ekber=اكبر
tevhid,tevhit=توحيد
vatan=وطن
millet=ملت|ملة
devlet=دولت|دولة
hürriyet=حريت|حرية
adalet=عدالت|عدالة
hayat=حيات|حياة
türk=ترك
türkiye=تركيه
osmanlı=عثمانلي
istanbul=استانبول|اسلامبول
ankara=آنقره
konya=قونيه
bursa=بروسه
edirne=ادرنه
izmir=ازمير
mekke=مكه|مكة
medine=مدينه|مدينة
kudüs=قدس
şam=شام
bağdat,bağdad=بغداد
kahire=قاهره|قاهرة
kabe=كعبه|كعبة
kandil=قنديل
cuma=جمعه|جمعة
ezan=اذان
cami=جامع
mescit,mescid=مسجد
sure=سوره|سورة
ayet=آيت|آية
fatiha=فاتحه|فاتحة
ihlas=اخلاص
felak=فلق
nas=ناس
mevlit,mevlid=مولد
kelime=كلمه|كلمة
tarih=تاريخ
ebced=ابجد
sultan=سلطان
padişah=پادشاه
hanım=خانم
bey=بگ
paşa=پاشا
efendi=افندي
hoca=خواجه
ağa=آغا
şeyh=شيخ
hacı=حاجي
molla=ملا
dede=دده
baba=بابا
ana=آنا
oğul=اوغول
kız=قيز
ev=او
su=صو
ay=آي
gün=گون
gece=گيجه
yıl=ييل
yol=يول
dağ=طاغ
taş=طاش
toprak=طوپراق
ateş=آتش
hava=هوا
ölüm=اولوم
doğum=طوغوم
savaş=صاواش
şehir=شهر
köy=كوي
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
for (const raw of DICT_SRC.split('\n')) {
  const line = raw.trim();
  if (!line || line.startsWith('#') || !line.includes('=')) continue;
  const [keys, vals] = line.split('=');
  let forms = vals.split('|');
  // Türkçe ebced geleneği: isim sonundaki ة Osmanlıca yazımla ه olur ve 5 sayılır; Arapça biçim seçenek kalır.
  if (forms[0].endsWith('ة')) forms = [`${forms[0].slice(0, -1)}ه`, ...forms];
  for (const k of keys.split(',')) {
    EXACT.set(plain(k).replace(/'/g, ''), forms);
    if (!FOLDED.has(fold(k))) FOLDED.set(fold(k), forms);
  }
}

/** Sözlükteki girdi sayısı (tanıtım/istatistik için). */
export const DICT_SIZE = EXACT.size;

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

# Ebced

Arapça metnin ebced (cümel) değerini hesaplayan statik sayfa — **https://ebced.perinet.org**

- Metin kutusuna yazılan/yapıştırılan metnin toplamı, harf ve kelime sayısı, sayı kökü; Kebîr, Mağribî ve Sağîr
  sistemlerinin toplamları yan yana.
- **Okuma ve seçim** alanında kelimenin üzerine gelince değeri ve harf dökümü görünür; fareyle (dokunmatikte basılı
  tutarak) bir kısım seçilince seçimin değeri hem seçimin üstünde hem **Seçim** kartında harf harf gösterilir.
  Metin kutusunda yapılan seçim de hesaplanır.
- Kelime listesi (tekrar sayısı, değere göre sıralama, metinde işaretleme), harf dağılımı, ebced cetveli,
  değerleri gösteren Arap harf klavyesi, paylaşılabilir bağlantı (`#t=…`).
- **Latin harfle yazım:** "Ahmet" yazınca احمد olarak hesaplanır. Önce yaklaşık 350 isim/kelimelik sözlüğe bakılır
  (Türkçe karakter olmadan da bulunur: huseyin → حسين), yoksa Osmanlıca yazım kurallarıyla tahmin edilir; akademik
  transkripsiyon (ḥ ṣ ṭ ʿ ā …) da tanınır. Her kelimenin yazılışı panelden düzeltilebilir, düzeltmeler tarayıcıda
  saklanır; "Metne Arap harfiyle yaz" metin kutusunu çevrilmiş metinle değiştirir (`public/latin.js`).
- **Ebced nedir?** penceresi: tanım, köken, harf değerleri, hesap kuralları, kullanım alanları (tarih düşürme vb.),
  hesap sistemleri ve dikkat edilecekler; `#nedir` bağlantısıyla doğrudan açılır.
- Ayarlar: Latin harf çevirisi açık/kapalı, ة 400/5, tek başına ء 1/0, ؤ ئ taşıyıcı/elif, آ 1/2, şedde bir/iki kez. Varsayılanlar TDV İslâm
  Ansiklopedisi “Ebced” maddesine göre (ة açık te, آ ve ء elif). Hareke, tenvin, hançerî elif ve Kur’an işaretleri
  sayılmaz; Farsça/Osmanlıca پ چ ژ گ ڭ ی ک temel harflere indirgenir, sunum biçimleri (ﻻ ﷲ) NFKC ile açılır.

Hesap tamamen tarayıcıda; sunucu tarafı yok.

## Dosyalar

- `public/ebced.js` — hesap mantığı (DOM'suz, testlerde de kullanılır)
- `public/latin.js` — Latin harf → Arap harf çevirisi (sözlük + kurala dayalı tahmin)
- `public/app.js`, `public/index.html`, `public/style.css` — arayüz
- `tests/*.test.mjs` — `npm test` (bilinen değerler: besmele 786, بلدة طيبة 857 …)
- `tools/deploy.mjs` — DNS → sertifika → NPM proxy host → HTTPS kontrolü (idempotent)

## Yayın

`ebced-web` konteyneri (`nginx:alpine`, `npm-net`) `public/` dizinini salt okunur bağlar:
**`public/` altındaki dosyayı kaydetmek = yayınlamak.** Cloudflare önbelleği için `index.html` içindeki
`?v=N` değerlerini artırın.

```bash
docker compose up -d
npm run deploy   # yalnız ilk kurulumda ya da kayıt silinirse
```

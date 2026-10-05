// Tarayıcı duman testi: sayfayı başsız Chrome'da açar, temel akışları dener.
//   NODE_PATH=~/.npm-global/lib/node_modules node tools/smoke.cjs [https://ebced.perinet.org/]
// Varsayılan adres yerel deneme sunucusudur: (cd public && python3 -m http.server 18431 --bind 127.0.0.1)
const puppeteer = require('puppeteer');

const URL = process.argv[2] ?? 'http://127.0.0.1:18431/';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = 0;
function check(name, ok, info = '') {
  console.log(`${ok ? '✓' : '✗'} ${name}${info ? ` — ${info}` : ''}`);
  if (!ok) failed++;
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const errors = [];
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  const text = (sel) => page.$eval(sel, (e) => e.textContent.trim());

  await page.click('[data-sample="besmele"]');
  check('besmele 786', (await text('#total')) === '786', await text('#total'));
  check('hicrî→milâdî satırı', (await text('#hicri')).includes('1384'), await text('#hicri'));

  await page.click('[data-sample="fetih"]');
  check('fetih 857 → 1453/54', (await text('#hicri')).includes('1453/54'), await text('#hicri'));

  await page.click('[data-sample="ihlas"]');
  check('ihlas 1.002', (await text('#total')) === '1.002', await text('#total'));

  // Okuma alanında üç kelimeyi seç → seçim kartı ve rozet
  await page.evaluate(() => {
    document.activeElement?.blur();
    const ws = document.querySelectorAll('#reader .w');
    const r = document.createRange();
    r.setStart(ws[0].firstChild, 0);
    r.setEnd(ws[2].firstChild, ws[2].firstChild.length);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
  });
  await wait(250);
  check('seçim 207', (await text('#sel-total')) === '207', await text('#sel-total'));
  check('rozet görünür', await page.$eval('#badge', (e) => !e.hidden && e.textContent === '207'));

  // Fareyle sürükleyerek seçim
  await page.evaluate(() => getSelection().removeAllRanges());
  const [a, z] = await page.$$eval('#reader .w', (ws) => ws.slice(3, 5).map((w) => {
    const r = w.getBoundingClientRect();
    return [r.left, r.top, r.width, r.height];
  }));
  await page.mouse.move(a[0] + a[2] - 2, a[1] + a[3] / 2);
  await page.mouse.down();
  await page.mouse.move(z[0] + 2, z[1] + z[3] / 2, { steps: 8 });
  await page.mouse.up();
  await wait(250);
  check('sürükleyerek seçim', (await text('#sel-total')) === '79', await text('#sel-total'));

  // Kelime üzerine gelme
  await page.evaluate(() => getSelection().removeAllRanges());
  const words = await page.$$('#reader .w');
  await words[2].hover();
  await wait(150);
  check('kelime balonu', await page.$eval('#pop', (e) => !e.hidden && e.textContent.includes('66')));

  // Latin harfli metin
  await page.click('#btn-clear');
  await page.type('#text', 'Ahmet Fatma Selahattin Kelebek');
  await wait(250);
  const rows = await page.$$eval('.lr', (rs) => rs.map((r) => [r.querySelector('.lr-src').textContent.trim(), r.querySelector('input').value, r.querySelector('.tag').textContent]));
  check('Latin paneli 4 satır', rows.length === 4, JSON.stringify(rows));
  check('Fatma → فاطمه (sözlük)', rows[1]?.[1] === 'فاطمه' && rows[1]?.[2] === 'sözlük');
  check('Kelebek tahmin', rows[3]?.[2] === 'tahmin');
  check('toplam 53+135+224+?', Number((await text('#total')).replace('.', '')) > 412, await text('#total'));
  await page.click('.lr:nth-child(2) .alt:nth-child(2)');
  await wait(150);
  check('Fatma Arapça seçenek 530', await page.$eval('.lr:nth-child(2) .lr-val', (e) => e.textContent.includes('530')));

  // Ebced nedir? penceresi
  await page.click('.learn-btn');
  await wait(300);
  check('pencere açıldı', await page.$eval('#learn', (d) => d.open));
  const eqs = await page.$$eval('.learn-ex .eq', (e) => e.map((x) => x.textContent));
  check('pencere örnekleri', JSON.stringify(eqs) === JSON.stringify(['= 92', '= 786', '= 857']), JSON.stringify(eqs));
  await page.keyboard.press('Escape');
  await wait(150);
  check('Escape kapatır', await page.$eval('#learn', (d) => !d.open));

  // Telefon genişliği: yatay taşma yok
  const mob = await browser.newPage();
  await mob.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mob.goto(URL, { waitUntil: 'networkidle0' });
  await mob.click('[data-sample="ihlas"]');
  check('telefonda yatay taşma yok', (await mob.evaluate(() => document.documentElement.scrollWidth)) === 390);

  check('konsol hatası yok', errors.length === 0, errors.join(' | '));
  await browser.close();
  console.log(failed ? `\n${failed} kontrol başarısız` : '\nHepsi geçti');
  process.exit(failed ? 1 : 0);
})();

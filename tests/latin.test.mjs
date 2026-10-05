import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transliterate, convertText, guess, DICT_SIZE } from '../public/latin.js';
import { value } from '../public/ebced.js';

test('sözlükteki isimler', () => {
  assert.ok(DICT_SIZE > 500, `sözlük küçük: ${DICT_SIZE}`);
  assert.equal(transliterate('Ahmet').ar, 'احمد');
  assert.equal(value(transliterate('ahmet').ar), 53);
  assert.equal(transliterate('MEHMET').ar, 'محمد');
  assert.equal(transliterate('ALİ').ar, 'علي');
  assert.equal(transliterate('ALI').ar, 'علي'); // Türkçe küçük harfte "alı" olur; katlanmış anahtar bulur
  assert.equal(transliterate('huseyin').ar, 'حسين');
  assert.equal(transliterate('Ertuğrul').ar, 'ارطغرل');
  assert.equal(transliterate("Kur'an").ar, 'قرآن');
  assert.equal(transliterate('Âdem').ar, 'آدم');
  assert.equal(transliterate('Yılmaz').ar, 'ييلماز');
  assert.equal(transliterate('Fatma').source, 'sözlük');
});

test('Türkçe ebced geleneği: isim sonunda ه, Arapça ة seçenek', () => {
  assert.deepEqual(transliterate('Fatma').alts, ['فاطمه', 'فاطمة']);
  assert.equal(value(transliterate('Fatma').ar), 135);
  assert.equal(value(transliterate('Ayşe').ar), 377);
  assert.equal(value(transliterate('Hamza').ar), 60);
  // Arapça kelimelerde Osmanlıca ت'li biçim önce, ة'li biçim seçenek; ه'li biçim üretilmez.
  assert.deepEqual(transliterate('zekat').alts, ['زكات', 'زكاة']);
});

test('birleşik adlar tek kelime, ayırıcı sayılmaz', () => {
  const t = transliterate('Selahattin');
  assert.ok(t.ar.includes('‌'));
  assert.equal(value(t.ar), 224);
  assert.equal(convertText('Celalettin').text.split(/\s/).length, 1);
});

test('ekli kelime ve tahmin', () => {
  const t = transliterate("Ahmet'in");
  assert.equal(t.source, 'sözlük + ek');
  assert.ok(t.ar.startsWith('احمد'));
  assert.equal(transliterate('kelebek').source, 'tahmin');
  assert.equal(guess('kara'), 'قاره');
  assert.equal(guess('deniz'), 'دنيز');
  assert.equal(guess('göz'), 'گوز');
  assert.equal(guess('ḥasan'), 'حسن');
  assert.equal(guess('ʿumar'), 'عمر');
  assert.equal(guess('fāṭıma'), 'فاطم');
  assert.equal(guess('ʿālim'), 'عالم');
});

test('metin çevirisi ve düzeltme', () => {
  const r = convertText('Ahmet ve Ayşe, ahmet');
  assert.equal(r.text, 'احمد و عائشه, احمد');
  assert.equal(r.items.find((i) => i.key === 'ahmet').count, 2);
  const o = convertText('Ahmet', { ahmet: 'أحمد' });
  assert.equal(o.text, 'أحمد');
  assert.equal(o.items[0].edited, true);
  assert.equal(convertText('بسم الله 786').text, 'بسم الله 786');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transliterate, convertText, guess } from '../public/latin.js';
import { value } from '../public/ebced.js';

test('sözlükteki isimler', () => {
  assert.equal(transliterate('Ahmet').ar, 'احمد');
  assert.equal(value(transliterate('ahmet').ar), 53);
  assert.equal(transliterate('MEHMET').ar, 'محمد');
  assert.equal(transliterate('ALİ').ar, 'علي');
  assert.equal(transliterate('ALI').ar, 'علي'); // Türkçe küçük harfte "alı" olur; katlanmış anahtar bulur
  assert.equal(transliterate('huseyin').ar, 'حسين');
  assert.equal(transliterate('Ertuğrul').ar, 'ارطغرل');
  assert.equal(transliterate("Kur'an").ar, 'قرآن');
  assert.equal(transliterate('Âdem').ar, 'آدم');
  assert.deepEqual(transliterate('Fatma').alts, ['فاطمة', 'فاطمه']);
  assert.equal(transliterate('Fatma').source, 'sözlük');
});

test('ekli kelime ve tahmin', () => {
  const t = transliterate("Ahmet'in");
  assert.equal(t.source, 'sözlük + ek');
  assert.ok(t.ar.startsWith('احمد'));
  assert.equal(transliterate('kara').source, 'tahmin');
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
  assert.equal(r.text, 'احمد و عائشة, احمد');
  assert.equal(r.items.find((i) => i.key === 'ahmet').count, 2);
  const o = convertText('Ahmet', { ahmet: 'أحمد' });
  assert.equal(o.text, 'أحمد');
  assert.equal(o.items[0].edited, true);
  assert.equal(convertText('بسم الله 786').text, 'بسم الله 786');
});

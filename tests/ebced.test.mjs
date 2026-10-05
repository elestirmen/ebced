// node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { value, analyze, tokenize, DEFAULT_OPTIONS } from '../public/ebced.js';

test('bilinen değerler', () => {
  assert.equal(value('بسم الله الرحمن الرحيم'), 786);
  assert.equal(value('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'), 786); // hareke, şedde, hançerî elif sayılmaz
  assert.equal(value('الله'), 66);
  assert.equal(value('محمد'), 92);
  assert.equal(value('علي'), 110);
  assert.equal(value('بلدة طيبة'), 857); // İstanbul'un fethi, 857 H.
  assert.equal(value('ﷲ'), 66); // tek karakterlik ligatür
  assert.equal(value('ﻻ'), 31);
  assert.equal(value('عائشه'), 377); // hemzeli ye elif gibi 1 (TDV), sondaki he 5
  assert.equal(value('مؤمن'), 131);
});

test('seçenekler', () => {
  assert.equal(DEFAULT_OPTIONS.hamzaSeat, 'alif');
  assert.equal(value('بلدة', { taMarbuta: 5 }), 41);
  assert.equal(value('ء'), 1);
  assert.equal(value('ء', { hamza: 0 }), 0);
  assert.equal(value('ؤئ'), 2);
  assert.equal(value('ؤئ', { hamzaSeat: 'carrier' }), 16);
  assert.equal(value('آ', { madda: 2 }), 2);
  assert.equal(value('مُحَمَّد', { shadda: 'twice' }), 132);
  assert.equal(value('مُحَمَّد'), 92);
});

test('sistemler', () => {
  assert.equal(value('صضسظغش', { system: 'magrib' }), 60 + 90 + 300 + 800 + 900 + 1000);
  assert.equal(value('صضسظغش'), 90 + 800 + 60 + 900 + 1000 + 300);
  assert.equal(value('ك', { system: 'sagir' }), 8);
  assert.equal(value('س', { system: 'sagir' }), 0);
  assert.equal(value('خ', { system: 'sagir' }), 0);
});

test('Farsça/Osmanlıca harfler ve Arap dışı karakterler', () => {
  assert.equal(value('پچژگڭ'), 2 + 3 + 7 + 20 + 20);
  assert.equal(value('یک'), 30);
  const r = analyze('abc 12 الله');
  assert.equal(r.total, 66);
  assert.equal(r.unknown, 5);
});

test('kelimelere bölme', () => {
  const t = tokenize('قُلْ هُوَ ۝ اللَّهُ، أَحَدٌ');
  assert.deepEqual(t.filter((x) => x.word).map((x) => x.text), ['قُلْ', 'هُوَ', 'اللَّهُ', 'أَحَدٌ']);
  assert.equal(t.map((x) => x.text).join(''), 'قُلْ هُوَ ۝ اللَّهُ، أَحَدٌ');
  // Görünmez ayırıcı (U+200C) kelimeyi bölmez ve sayılmaz.
  const c = tokenize('جلال‌الدين');
  assert.equal(c.length, 1);
  assert.equal(value('جلال‌الدين'), 3 + 30 + 1 + 30 + 1 + 30 + 4 + 10 + 50); // 159
});

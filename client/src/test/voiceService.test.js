import { describe, it, expect } from 'vitest';
import {
  normalizeLocale,
  normalizeVoice,
  matchesLanguage,
  getVoicesForLanguage,
  sortVoices,
  buildLanguageList,
  generateVoiceDiagnostics,
  CURATED_LANGUAGES
} from '../services/voiceService';

describe('Voice & Language Service (Single Source of Truth)', () => {
  // Realistic mock voice dataset representing typical macOS/Windows/Chromium environment
  const mockRawVoices = [
    { name: 'Rishi', lang: 'en_IN', default: true, localService: true, voiceURI: 'Rishi' },
    { name: 'Samantha', lang: 'en-US', default: true, localService: true, voiceURI: 'Samantha' },
    { name: 'Alex', lang: 'en-US', default: false, localService: true, voiceURI: 'Alex' },
    { name: 'Victoria', lang: 'en-US', default: false, localService: false, voiceURI: 'Victoria' },
    { name: 'Daniel', lang: 'en-GB', default: true, localService: true, voiceURI: 'Daniel' },
    { name: 'Lekha', lang: 'hi-IN', default: false, localService: true, voiceURI: 'Lekha' },
    { name: 'Kyoko', lang: 'ja-JP', default: false, localService: true, voiceURI: 'Kyoko' },
    { name: 'Monica', lang: 'es-ES', default: false, localService: true, voiceURI: 'Monica' },
    { name: 'Thomas', lang: 'fr-FR', default: false, localService: true, voiceURI: 'Thomas' },
    { name: 'Anna', lang: 'de-DE', default: true, localService: true, voiceURI: 'Anna' }
  ];

  const normalizedVoices = mockRawVoices.map((v, i) => normalizeVoice(v, i));

  it('1. Exact locale matching: en-IN matches only en-IN voices and normalizes underscores', () => {
    const enInVoices = getVoicesForLanguage(normalizedVoices, 'en-IN');
    expect(enInVoices).toHaveLength(1);
    expect(enInVoices[0].name).toBe('Rishi');
    expect(enInVoices[0].languageCode).toBe('en-IN');
  });

  it('2. Different locale exclusion: en-IN does NOT count en-US or en-GB voices', () => {
    const enInVoices = getVoicesForLanguage(normalizedVoices, 'en-IN');
    const names = enInVoices.map((v) => v.name);

    expect(names).toContain('Rishi');
    expect(names).not.toContain('Samantha');
    expect(names).not.toContain('Alex');
    expect(names).not.toContain('Victoria');
    expect(names).not.toContain('Daniel');
  });

  it('3. Strict equality: languageCount === filteredVoiceList.length for all curated languages', () => {
    const langList = buildLanguageList(normalizedVoices, CURATED_LANGUAGES);

    for (const lang of langList) {
      const filtered = getVoicesForLanguage(normalizedVoices, lang.code);
      expect(lang.installedVoicesCount).toBe(filtered.length);
      expect(lang.hasInstalledVoice).toBe(filtered.length > 0);
    }
  });

  it('4. Zero voices: returns [] and count is 0 when no voice is installed for language', () => {
    // Gujarati and Marathi have 0 voices in this mock set
    const guVoices = getVoicesForLanguage(normalizedVoices, 'gu-IN');
    const mrVoices = getVoicesForLanguage(normalizedVoices, 'mr-IN');

    expect(guVoices).toHaveLength(0);
    expect(mrVoices).toHaveLength(0);

    const langList = buildLanguageList(normalizedVoices, CURATED_LANGUAGES);
    const guLang = langList.find((l) => l.code === 'gu-IN');
    const mrLang = langList.find((l) => l.code === 'mr-IN');

    expect(guLang.installedVoicesCount).toBe(0);
    expect(guLang.hasInstalledVoice).toBe(false);
    expect(mrLang.installedVoicesCount).toBe(0);
    expect(mrLang.hasInstalledVoice).toBe(false);
  });

  it('5. Single voice: count = 1 and selector contains exactly one voice', () => {
    const enInVoices = getVoicesForLanguage(normalizedVoices, 'en-IN');
    expect(enInVoices).toHaveLength(1);
    expect(enInVoices[0].name).toBe('Rishi');
  });

  it('6. Multiple voices: returns all matching voices in consistent order', () => {
    const enUsVoices = getVoicesForLanguage(normalizedVoices, 'en-US');
    expect(enUsVoices).toHaveLength(3);
    // Samantha is default, so it should be first
    expect(enUsVoices[0].name).toBe('Samantha');
    expect(enUsVoices[0].default).toBe(true);
  });

  it('7. Duplicate voice prevention: removes duplicated voice entries safely', () => {
    const voicesWithDuplicates = [
      ...normalizedVoices,
      normalizeVoice({ name: 'Rishi', lang: 'en-IN', default: true, localService: true, voiceURI: 'Rishi' }, 99)
    ];

    const deduplicated = getVoicesForLanguage(voicesWithDuplicates, 'en-IN');
    expect(deduplicated).toHaveLength(1);
  });

  it('8. Normalization creates complete metadata without modifying original object', () => {
    const raw = { name: 'TestVoice', lang: 'en_IN', default: true, localService: true, voiceURI: 'test-uri' };
    const norm = normalizeVoice(raw, 0);

    expect(norm).toEqual({
      id: 'TestVoice__en-IN__test-uri',
      name: 'TestVoice',
      lang: 'en_IN',
      languageCode: 'en-IN',
      languageBase: 'en',
      region: 'IN',
      default: true,
      localService: true,
      voice: raw
    });

    // Native object must remain untouched
    expect(raw.languageCode).toBeUndefined();
    expect(raw.id).toBeUndefined();
  });

  it('9. Deterministic sorting: default voice first, localService second, then alphabetical', () => {
    const sample = [
      { name: 'Charlie', languageCode: 'en-US', default: false, localService: false },
      { name: 'Bravo', languageCode: 'en-US', default: false, localService: true },
      { name: 'Alpha', languageCode: 'en-US', default: true, localService: true }
    ];

    const sorted = sortVoices(sample);
    expect(sorted[0].name).toBe('Alpha'); // default
    expect(sorted[1].name).toBe('Bravo'); // localService
    expect(sorted[2].name).toBe('Charlie'); // remote
  });

  it('10. Default voice labeling: only true system defaults are labeled default', () => {
    const enInVoices = getVoicesForLanguage(normalizedVoices, 'en-IN');
    const hiInVoices = getVoicesForLanguage(normalizedVoices, 'hi-IN');

    // Rishi has default: true
    expect(enInVoices[0].default).toBe(true);

    // Lekha has default: false
    expect(hiInVoices[0].default).toBe(false);
  });

  it('11. Dynamic discovery: discovers installed languages not in curated list', () => {
    const langList = buildLanguageList(normalizedVoices, CURATED_LANGUAGES);
    const jaLang = langList.find((l) => l.code === 'ja-JP');

    expect(jaLang).toBeDefined();
    expect(jaLang.installedVoicesCount).toBe(1);
    expect(jaLang.hasInstalledVoice).toBe(true);
  });

  it('12. Diagnostics utility verifies all languages without assertion failure', () => {
    const langList = buildLanguageList(normalizedVoices, CURATED_LANGUAGES);
    const matrix = generateVoiceDiagnostics(normalizedVoices, langList);

    expect(matrix).toHaveLength(langList.length);
    for (const row of matrix) {
      expect(row['Voices Match']).toBe('✅ YES');
      expect(row['Displayed Count']).toBe(row['Actual Voices']);
    }
  });
});

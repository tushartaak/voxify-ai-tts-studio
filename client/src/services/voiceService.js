/**
 * Authoritative Voice & Language Service for Voxify
 * Single Source of Truth for Web Speech API Voice Enumeration, Normalization, and Locale Matching.
 */

// Curated languages with native display names and flags
export const CURATED_LANGUAGES = [
  { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'en-GB', name: 'English (United Kingdom)', flag: '🇬🇧' },
  { code: 'hi-IN', name: 'Hindi (भारत)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati (ગુજરાત)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi (महाराष्ट्र)', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (España)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutschland)', flag: '🇩🇪' }
];

/**
 * Standardize locale tag to BCP-47 standard (e.g., 'en_us' -> 'en-US', 'en-in' -> 'en-IN')
 */
export function normalizeLocale(locale) {
  if (!locale || typeof locale !== 'string') return '';
  const cleaned = locale.trim().replace(/_/g, '-');
  const parts = cleaned.split('-');
  const base = parts[0].toLowerCase();
  if (parts.length === 1) return base;
  const region = parts[1].toUpperCase();
  const rest = parts.slice(2);
  return [base, region, ...rest].join('-');
}

/**
 * Convert 2-letter country code to Unicode Flag Emoji
 */
export function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Normalize a native SpeechSynthesisVoice object into a standardized structure
 * without mutating the native voice object.
 */
export function normalizeVoice(voice, index = 0) {
  if (!voice) return null;
  const normalizedLocale = normalizeLocale(voice.lang);
  const parts = normalizedLocale.split('-');
  const base = parts[0] || '';
  const region = parts[1] || '';

  // Stable identity combining name, normalized language, and voiceURI/index
  const stableId = `${voice.name}__${normalizedLocale}__${voice.voiceURI || index}`;

  return {
    id: stableId,
    name: voice.name,
    lang: voice.lang,
    languageCode: normalizedLocale,
    languageBase: base,
    region: region,
    default: Boolean(voice.default),
    localService: Boolean(voice.localService),
    voice: voice // Keep native reference for SpeechSynthesisUtterance.voice
  };
}

/**
 * Exact BCP-47 Locale Matching Rule:
 * A voice matches a target locale if and only if their normalized BCP-47 representations match exactly.
 * For example:
 * - 'en-IN' matches only 'en-IN' (or 'en_IN')
 * - 'en-IN' does NOT match 'en-US', 'en-GB', or generic 'en'
 */
export function matchesLanguage(voice, targetLocale) {
  if (!voice || !targetLocale) return false;
  const voiceCode = normalizeLocale(voice.languageCode || voice.lang || '');
  const targetCode = normalizeLocale(targetLocale);
  if (!voiceCode || !targetCode) return false;
  return voiceCode.toLowerCase() === targetCode.toLowerCase();
}

/**
 * Deterministic Voice Sorting Order:
 * 1. Selected voice first (if provided)
 * 2. True system default voice (voice.default === true)
 * 3. On-device/Local voices (localService === true)
 * 4. Alphabetical by voice name
 * 5. Secondary sort by language locale
 */
export function sortVoices(voices, selectedVoiceName = null) {
  return [...voices].sort((a, b) => {
    if (selectedVoiceName) {
      if (a.name === selectedVoiceName) return -1;
      if (b.name === selectedVoiceName) return 1;
    }
    if (a.default && !b.default) return -1;
    if (!a.default && b.default) return 1;
    if (a.localService && !b.localService) return -1;
    if (!a.localService && b.localService) return 1;
    const nameCmp = a.name.localeCompare(b.name);
    if (nameCmp !== 0) return nameCmp;
    return a.languageCode.localeCompare(b.languageCode);
  });
}

/**
 * Single Authoritative Voice Filtering Function:
 * Returns the exact array of voices matching the specified language.
 * Used for BOTH counting in the LanguageSelector and rendering in the VoiceSelector.
 */
export function getVoicesForLanguage(allVoices, targetLocale, selectedVoiceName = null) {
  if (!Array.isArray(allVoices) || allVoices.length === 0 || !targetLocale) {
    return [];
  }

  // 1. Filter by exact locale matching
  const matching = allVoices.filter((v) => matchesLanguage(v, targetLocale));

  // 2. Stable Deduplication by (name + languageCode + voiceURI)
  const seen = new Set();
  const deduplicated = [];
  for (const v of matching) {
    const key = `${v.name}__${v.languageCode}__${v.voice?.voiceURI || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(v);
    }
  }

  // 3. Deterministic Sorting
  return sortVoices(deduplicated, selectedVoiceName);
}

/**
 * Build language list from real browser voices merged with curated languages.
 * Every language's installedVoicesCount is calculated using getVoicesForLanguage.
 */
export function buildLanguageList(allVoices = [], curatedLanguages = CURATED_LANGUAGES) {
  const result = [];
  const processedCodes = new Set();

  // 1. Process curated languages first
  for (const lang of curatedLanguages) {
    const normCode = normalizeLocale(lang.code);
    const voicesForLang = getVoicesForLanguage(allVoices, normCode);
    const count = voicesForLang.length;

    result.push({
      code: normCode,
      name: lang.name,
      flag: lang.flag || getFlagEmoji(normCode.split('-')[1]),
      installedVoicesCount: count,
      hasInstalledVoice: count > 0,
      isCurated: true
    });
    processedCodes.add(normCode.toLowerCase());
  }

  // 2. Discover other locales present in installed browser voices
  if (Array.isArray(allVoices)) {
    const intlDisplay = typeof Intl !== 'undefined' && Intl.DisplayNames
      ? new Intl.DisplayNames(['en'], { type: 'language' })
      : null;

    const otherLocales = new Map();

    for (const v of allVoices) {
      const code = v.languageCode;
      if (!code || processedCodes.has(code.toLowerCase())) continue;

      if (!otherLocales.has(code)) {
        let displayName = code;
        try {
          if (intlDisplay) {
            displayName = intlDisplay.of(code) || code;
          }
        } catch {
          displayName = code;
        }

        const region = code.split('-')[1] || '';
        const flag = getFlagEmoji(region);

        otherLocales.set(code, {
          code,
          name: displayName,
          flag,
          isCurated: false
        });
      }
    }

    // Sort discovered languages alphabetically by name
    const discoveredList = Array.from(otherLocales.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    for (const lang of discoveredList) {
      const voicesForLang = getVoicesForLanguage(allVoices, lang.code);
      const count = voicesForLang.length;
      result.push({
        ...lang,
        installedVoicesCount: count,
        hasInstalledVoice: count > 0
      });
      processedCodes.add(lang.code.toLowerCase());
    }
  }

  return result;
}

/**
 * Diagnostic Voice Matrix Utility for Development Verification
 */
export function generateVoiceDiagnostics(allVoices = [], languages = []) {
  const matrix = languages.map((lang) => {
    const voices = getVoicesForLanguage(allVoices, lang.code);
    const count = voices.length;
    // Assertion: Language count MUST strictly equal filtered voices length
    console.assert(
      lang.installedVoicesCount === count,
      `[Voxify Voice Audit Failure] Language count mismatch for ${lang.name} (${lang.code}): lang count is ${lang.installedVoicesCount}, but getVoicesForLanguage returned ${count}!`
    );
    return {
      Language: lang.name,
      Locale: lang.code,
      'Displayed Count': lang.installedVoicesCount,
      'Actual Voices': count,
      'Voices Match': lang.installedVoicesCount === count ? '✅ YES' : '❌ MISMATCH',
      'Voice Names': voices.map((v) => v.name + (v.default ? ' [Default]' : '')).join(', ') || '(none)'
    };
  });

  return matrix;
}

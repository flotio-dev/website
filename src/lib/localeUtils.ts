// LocaleUtils.ts
export type Locale = "fr" | "en";

export const getPreferredLocale = (p?: string | null): Locale => {
  try {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "en" || stored === "fr") return stored;
  } catch {
  }

  if (!p) return "fr";

  const parts = p.split("/");
  const candidate = parts[1];
  if (candidate === "en" || candidate === "fr") return candidate;

  return "fr";
};

// --- Store global traductions ---

let translations: Record<string, any> | null = null;

export const setTranslations = (data: Record<string, any>) => {
  translations = data;
};

export const getCurrentTranslations = () => translations;

/**
 * Translates a given key into the current locale's string using the loaded translations.
 * If the key is not found or translations are not loaded, returns the key itself.
 *
 * @param {string} key - The translation key, using dot notation for nested keys (e.g., "home.title").
 * @returns {string} The translated string, or the key if not found.
 */
export const t = (key: string): string => {
  if (!translations) return key;

  const parts = key.split(".");
  let cur: any = translations;

  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) {
      cur = cur[p];
    } else {
      return key;
    }
  }

  return typeof cur === "string" ? cur : key;
};

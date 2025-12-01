// useLocalization.ts
import { useEffect, useState, useCallback } from "react";
import {
    Locale,
    getPreferredLocale,
    setTranslations as setGlobalTranslations,
    t as globalT,
    getCurrentTranslations,
} from "../localeUtils";

import { getTranslations } from "../clientTranslations";

interface UseLocalizationOptions {
    pathname?: string;
}

export const useLocalization = (options: UseLocalizationOptions = {}) => {
    const { pathname } = options;

    const [locale, setLocale] = useState<Locale>(() => {
        if (typeof window !== "undefined") {
            return getPreferredLocale(pathname ?? window.location.pathname);
        }
        return "fr";
    });

    const [translations, setTranslationsState] = useState<Record<string, any> | null>(
        getCurrentTranslations()
    );

    useEffect(() => {
        if (typeof window === "undefined") return;
        const effectiveLocale = getPreferredLocale(
            pathname ?? window.location.pathname
        );
        if (effectiveLocale !== locale) {
            setLocale(effectiveLocale);
        }
    }, [pathname]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let mounted = true;

        const load = async (loc: Locale) => {
            const json = await getTranslations(loc);
            if (!mounted) return;
            setTranslationsState(json);
            setGlobalTranslations(json);
        };

        load(locale);

        const onLocaleChanged = (e: any) => {
            const newLoc =
                e?.detail ??
                (typeof window !== "undefined" ? localStorage.getItem("lang") : null);

            if (newLoc === "en" || newLoc === "fr") {
                setLocale(newLoc);
            }
        };

        window.addEventListener("localeChanged", onLocaleChanged as EventListener);

        const onStorage = () => onLocaleChanged(null);
        window.addEventListener("storage", onStorage);

        return () => {
            mounted = false;
            window.removeEventListener(
                "localeChanged",
                onLocaleChanged as EventListener
            );
            window.removeEventListener("storage", onStorage);
        };
    }, [locale]);

    const t = useCallback((key: string) => globalT(key), []);

    return { locale, setLocale, translations, t };
};

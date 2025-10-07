import { writable } from 'svelte/store';

type Dictionary = Record<string, any>;

/** The loaded locale dictionary. */
let currentLocaleDict: Dictionary = {};
/** The dictionary which keys will be used if they are not present in the currentLocaleDict. */
let fallbackLocaleDict: Dictionary = {};
/** Precalculated, merged dictionary that will be used in your components. */
let mergedLocaleDict: Dictionary = $state.raw({});

/** A simple function that deeply merges two objects together. */
const merge = () => {
    const newDict: Dictionary = structuredClone(fallbackLocaleDict);
    const walker = (part: Dictionary, target: Dictionary) => {
        for (const i in target) {
            const val = part[i];
            if (!val) continue;
            if (Array.isArray(val) || typeof val === 'object') {
                walker(val as Dictionary, target[i] as Dictionary);
            } else {
                target[i] = val;
            }
        }
    }
    walker('default' in currentLocaleDict ? currentLocaleDict.default : currentLocaleDict, newDict);
    mergedLocaleDict = newDict;
};

/** Maps locale IDs with functions to either the dictionary or the function that will load the dictionary file. */
let localeMap: Record<string, (() => Promise<Dictionary>) | Dictionary> = {};

/** Adds the given object as a preloaded dictionary */
export const addMessages = (code: string, messages: Dictionary) => {
    localeMap[code] = messages;
    localeMap = { ...localeMap };
};
/**
 * Registers a way to load a dictionary for the given locale code.
 * Usually it is a callback with a dynamic import or a fetch request.
 */
export const register = (code: string, registrar: () => Promise<Dictionary>) => {
    localeMap[code] = registrar;
    localeMap = { ...localeMap };
};

/** Loads the needed dictionary. */
const getLocale = (code: string): Promise<Dictionary> | Dictionary => {
    if (code in localeMap) {
        const l = localeMap[code];
        if (l instanceof Function) {
            const promise = l();
            promise.then((dict: Dictionary) => localeMap[code] = dict);
            return promise;
        }
        return l;
    }
    throw new Error(`No locale ${code} was defined.`);
}

/** A function that must be called once when your app starts.
 * It initializes the dictionary with fallbackLocale, and then applies the initialLocale on top of it.
 */
export const init = async ({
    initialLocale,
    fallbackLocale
}: {
    initialLocale: string
    fallbackLocale: string
}) => {
    fallbackLocaleDict = getLocale(fallbackLocale) as Dictionary;
    mergedLocaleDict = fallbackLocaleDict;
    locale.set(fallbackLocale);
    currentLocaleDict = await getLocale(initialLocale);
    locale.set(initialLocale);
    merge();
};

/** Currently used locale ID. Is a writable Svelte store. */
export const locale = writable<string>('');
locale.subscribe(async val => {
    if (!val) return;
    currentLocaleDict = await getLocale(val);
    merge();
});
/** Lists IDs of all the available locales. */
export const getLocales = () => Object.keys(localeMap);

/** Derives the most suiting locale from navigator's information. */
export const getLocaleFromNavigator = (deflt: string) => {
    if (navigator.language in localeMap) {
        return navigator.language;
    }
    if (navigator.language.includes('-')) {
        const [firstPart] = navigator.language.split('-');
        if (firstPart in localeMap) {
            return firstPart;
        }
    }
    // No locale loaded; use the existing one
    return deflt;
}

/** Translates a key with optional interpolation values */
export const t = (key: string, vars?: Record<string, string | number>): string => {
    const getValue = (obj: Dictionary, path: string): any => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    };

    let value = getValue(mergedLocaleDict, key);

    if (typeof value !== 'string') {
        console.warn(`Missing translation for key "${key}"`);
        return key;
    }

    if (vars) {
        for (const [varKey, varValue] of Object.entries(vars)) {
            value = value.replaceAll(`{${varKey}}`, varValue);
        }
    }

    return value;
};
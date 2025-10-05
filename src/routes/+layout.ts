export const ssr = true;

import {init, getLocaleFromNavigator, addMessages} from '$lib/i18n/index.svelte';

// Setup UI translations
import en from '$lib/i18n/en.json';
addMessages('en', en);

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator('en')
});
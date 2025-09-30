import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Ingredient } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const res = await fetch(`${PUBLIC_API_URL}/Ingredient/`);
        const data = await res.json()
        const ingredients: Ingredient[] = data.Result;

        return {
            ingredients
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }

};
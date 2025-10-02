import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Ingredient } from '$lib/types';


export const load: PageLoad = async ({ fetch }) => {
    try {
        const res = await fetch(`${PUBLIC_API_URL}/Ingredient/`);
        const data = await res.json()
        const items: Ingredient[] = data.Result;

        return {
            items
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }

};
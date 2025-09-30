import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Recipe } from '$lib/types';


export const load: PageLoad = async ({ fetch }) => {
    try {
        const res = await fetch(`${PUBLIC_API_URL}/Recipe/`);
        const data = await res.json()
        const recipes: Recipe[] = data.Result;

        return {
            recipes
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }

};
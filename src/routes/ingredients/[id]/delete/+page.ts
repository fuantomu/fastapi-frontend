import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Ingredient } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const { id } = params;
        const res = await fetch(`${PUBLIC_API_URL}/Ingredient/?id=${id}`);
        const data = await res.json()
        const item: Ingredient = data.Result[0];

        return {
            item
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }
};
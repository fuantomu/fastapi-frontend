import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Guild } from '$lib/types';
import { sortBy } from '$lib/helper/sort';


export const load: PageLoad = async ({ fetch, params }) => {
    try {
        const res = await fetch(`${PUBLIC_API_URL}/Guild/?version=${params.gameVersion}`);
        const data = await res.json()
        const items: Guild[] = data.Result;

        items.sort((a, b) => sortBy(a, b, "name"));

        return {
            items
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }

};
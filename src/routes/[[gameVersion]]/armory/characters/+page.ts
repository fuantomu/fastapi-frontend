import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Character, Guild } from '$lib/types';
import { sortBy } from '$lib/helper/sort';


export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const res_characters = await fetch(`${PUBLIC_API_URL}/Character/?version=${params.gameVersion}`);
        const data_characters = await res_characters.json()
        const items: Character[] = data_characters.Result;

        items.sort((a, b) => sortBy(a, b, "name"));

        const res_guilds = await fetch(`${PUBLIC_API_URL}/Guild/?version=${params.gameVersion}`);
        const data_guilds = await res_guilds.json()
        const guilds: Guild[] = data_guilds.Result;

        return {
            items,
            guilds
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }

};
import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Character, Guild } from '$lib/types';


export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const { id } = params;
        const res_character = await fetch(`${PUBLIC_API_URL}/Character/?id=${id}`);
        const data_character = await res_character.json()
        const item: Character = data_character.Result[0];

        const res_guild = await fetch(`${PUBLIC_API_URL}/Guild/`);
        const data_guilds = await res_guild.json()
        const guilds: Guild[] = data_guilds.Result;

        return {
            item,
            guilds
        };

    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }
};
import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Guild } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const res_guild = await fetch(`${PUBLIC_API_URL}/Guild/`);
        const data_guilds = await res_guild.json()
        const guilds: Guild[] = data_guilds.Result;

        return {
            guilds
        };

    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }
};
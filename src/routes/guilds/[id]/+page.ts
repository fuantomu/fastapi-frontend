import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Guild } from '$lib/types';


export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const { id } = params;
        const res = await fetch(`${PUBLIC_API_URL}/Guild/?id=${id}`);
        const data = await res.json()
        const item: Guild = data.Result[0];

        const guilds_res = await fetch(`${PUBLIC_API_URL}/Guild/`);
        const guilds_data = await guilds_res.json()
        const guilds: Guild[] = guilds_data.Result;

        return {
            item,
            guilds
        };

    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }
};
import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Character, CharacterEquipment, Guild } from '$lib/types';


export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const { id } = params;
        const res_character = await fetch(`${PUBLIC_API_URL}/Character/?id=${id}`);
        const data_character = await res_character.json()
        const item: Character = data_character.Result[0];

        const res_characters = await fetch(`${PUBLIC_API_URL}/Character/`);
        const data_characters = await res_characters.json()
        const characters: Character[] = data_characters.Result.filter((character: Character) => character.name !== item.name);

        const res_guild = await fetch(`${PUBLIC_API_URL}/Guild/`);
        const data_guilds = await res_guild.json()
        const guilds: Guild[] = data_guilds.Result;

        const res_equipment = await fetch(`${PUBLIC_API_URL}/Character/Equipment/?id=${id}`);
        const data_equipment = await res_equipment.json()
        const equipment: CharacterEquipment = data_equipment.Result;

        return {
            item,
            guilds,
            equipment,
            characters
        };

    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }
};
import { PUBLIC_API_URL } from '$env/static/public';
import type { Faction, Gender, PlayerClass, PlayerSpec, Race } from '$lib/consts';
import type { Character } from '$lib/types';

export async function handleCharacterSubmit(formData: FormData) {
    const id = formData.get('id') as unknown as number
    const name = formData.get('name') as string
    const gender = formData.get('gender') as Gender
    const faction = formData.get('faction') as Faction
    const race = formData.get('race') as Race
    const character_class = formData.get('character_class') as PlayerClass
    const active_spec = formData.get('active_spec') as PlayerSpec
    const realm = formData.get('realm') as string
    const guild = formData.get('guild') as unknown as number
    const level = formData.get('achievement_points') as string
    const achievement_points = formData.get('achievement_points') as string
    const last_login_timestamp = formData.get('last_login_timestamp') as string
    const average_item_level = formData.get('average_item_level') as string
    const equipped_item_level = formData.get('equipped_item_level') as string
    const active_title = formData.get('active_title') as string

    const character: Character = {
        id,
        name,
        gender,
        faction,
        race,
        character_class,
        active_spec,
        realm,
        guild,
        level : Number(level),
        achievement_points : Number(achievement_points),
        last_login_timestamp : new Date(last_login_timestamp).getTime(),
        average_item_level : Number(average_item_level),
        equipped_item_level : Number(equipped_item_level),
        active_title
    };

    if (!character.last_login_timestamp){
        character.last_login_timestamp = Date.now()
    }

    let response = await fetch(`${PUBLIC_API_URL}/Character/`, {
        method: 'POST', body: JSON.stringify(character), headers: {
            'Content-Type': 'application/json'
        },
    })
    
    if (id == 0) {
        let data = await response.json();
        return `/characters/${data['Result']}` 
    }
    return `/characters/${id}`
}

export async function handleCharacterDelete(formData: FormData) {
    const id = formData.get('id') as string

    await fetch(`${PUBLIC_API_URL}/Character/?id=${id}`, {
        method: 'DELETE',
    })
}
import { PUBLIC_API_URL } from '$env/static/public';
import { RealmVersion, type Faction, type Gender, type PlayerClass, type PlayerSpec, type Race, type Region } from '$lib/consts';
import type { Character, CharacterItem, CharacterSpec } from '$lib/types';
import type { GameVersionName } from '$lib/versions/GameVersion';

export async function handleCharacterSubmit(formData: FormData): Promise<string> {
    const id = formData.get('id') as unknown as number
    const name = formData.get('name') as string
    const gender = formData.get('gender') as Gender
    const faction = formData.get('faction') as Faction
    const race = formData.get('race') as Race
    const character_class = formData.get('character_class') as PlayerClass
    let active_spec = formData.get('active_spec') as PlayerSpec
    active_spec = active_spec?.replace(character_class, "") as PlayerSpec
    const realm = formData.get('realm') as string
    const guild = formData.get('guild') as unknown as number
    const level = formData.get('level') as string
    const achievement_points = formData.get('achievement_points') as string
    const last_login_timestamp = formData.get('last_login_timestamp') as string
    const equipped_item_level = formData.get('equipped_item_level') as string
    const active_title = formData.get('active_title') as string
    const version = formData.get('version') as GameVersionName
    const region = formData.get('region') as Region
    const realm_version = formData.get('realm_version') as RealmVersion

    const character: Character = {
        id,
        name,
        gender,
        faction,
        race,
        character_class,
        active_spec,
        realm,
        guild: guild ? Number(guild) : -1,
        level: Number(level) ?? 1,
        achievement_points: Number(achievement_points),
        last_login_timestamp: new Date(last_login_timestamp).getTime(),
        equipped_item_level: Number(equipped_item_level),
        active_title,
        region,
        version,
        realm_version
    };

    if (!character.last_login_timestamp) {
        character.last_login_timestamp = Date.now()
    }

    let response = await fetch(`${PUBLIC_API_URL}/Character/`, {
        method: 'POST', body: JSON.stringify(character), headers: {
            'Content-Type': 'application/json'
        },
    })

    let data = await response.json();

    if (id == 0 || Number.isInteger(Number(data["Result"]))) {

        return `/characters/${data['Result']}`
    }
    return `/characters/${id}`
}

export async function handleCharacterDelete(formData: FormData) {
    const id = formData.get('id') as string
    const gameVersion = formData.get('gameVersion') as string

    await fetch(`${PUBLIC_API_URL}/Character/?id=${id}&version=${gameVersion}`, {
        method: 'DELETE',
    })
}

export async function handleDirectCharacterSubmit(character: Character): Promise<string> {
    character.id = character.id ?? 0
    if (!character.last_login_timestamp) {
        character.last_login_timestamp = Date.now()
    }
    let response = await fetch(`${PUBLIC_API_URL}/Character/`, {
        method: 'POST', body: JSON.stringify(character), headers: {
            'Content-Type': 'application/json'
        },
    })

    let data = await response.json();
    if (character.id == 0 || Number.isInteger(Number(data["Result"]))) {

        return `/characters/${data['Result']}`
    }
    return `/characters/${character.id}`
}

export async function handleDirectEquipmentSubmit(equipment: CharacterItem, id: number, version: string) {
    await fetch(`${PUBLIC_API_URL}/Character/Equipment/?id=${id}&version=${version}`, {
        method: 'POST', body: JSON.stringify(equipment), headers: {
            'Content-Type': 'application/json'
        },
    })

    return "Success"
}

export async function handleDirectSpecializationSubmit(specialization: CharacterSpec) {
    if (specialization.name === "" || !specialization.name){
        return "Error: Name of specialization not set"
    }
    await fetch(`${PUBLIC_API_URL}/Character/Specialization/`, {
        method: 'POST', body: JSON.stringify(specialization), headers: {
            'Content-Type': 'application/json'
        },
    })
    return "Success"
}
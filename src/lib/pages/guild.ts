import { PUBLIC_API_URL } from '$env/static/public';
import type { Faction, RealmVersion, Region } from '$lib/consts';
import type { Guild } from '$lib/types';
import type { GameVersionName } from '$lib/versions/GameVersion';

export async function handleGuildSubmit(formData: FormData) {
    const id = formData.get('id') as unknown as number
    const name = formData.get('name') as string
    const faction = formData.get('faction') as Faction
    const realm = formData.get('realm') as string
    const achievement_points = formData.get('achievement_points') as string
    const member_count = formData.get('member_count') as string
    const created_timestamp = formData.get('created_timestamp') as string
    const version = formData.get('version') as GameVersionName
    const region = formData.get('region') as Region
    const realm_version = formData.get("realm_version") as RealmVersion

    const guild: Guild = {
        id,
        name,
        faction,
        realm,
        achievement_points: Number(achievement_points) ?? 0,
        member_count: Number(member_count) ?? 0,
        created_timestamp: Number(created_timestamp) ?? Date.now(),
        region,
        version,
        realm_version
    };


    let response = await fetch(`${PUBLIC_API_URL}/Guild/`, {
        method: 'POST', body: JSON.stringify(guild), headers: {
            'Content-Type': 'application/json'
        },
    })
    let data = await response.json();
    if (id == 0) {
        
        return `/guilds/${data['Result']}`
    }
    return `/guilds/${id}`

}

export async function handleGuildDelete(formData: FormData) {
    const id = formData.get('id') as string

    await fetch(`${PUBLIC_API_URL}/Guild/?id=${id}`, {
        method: 'DELETE',
    })
}

export async function handleGuildSearch(formData: FormData) {
    const name = formData.get('search') as string
    const realm = formData.get('realmInput') as string
    const region = formData.get('guildRegionSelect') as string
    const version = formData.get('version') as string

    let response = await fetch(`${PUBLIC_API_URL}/Guild/Search?name=${name}&realm=${realm}&region=${region}&version=${version}`, {
        method: 'GET',headers: {
            'Content-Type': 'application/json'
        },
    })

    return response
}
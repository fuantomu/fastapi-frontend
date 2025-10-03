import { PUBLIC_API_URL } from '$env/static/public';
import type { Faction } from '$lib/consts';
import type { Guild } from '$lib/types';

export async function handleGuildSubmit(formData: FormData) {
    const id = formData.get('id') as unknown as number
    const name = formData.get('name') as string
    const faction = formData.get('faction') as Faction
    const realm = formData.get('realm') as string
    const achievement_points = formData.get('achievement_points') as string
    const member_count = formData.get('member_count') as string
    const created_timestamp = formData.get('created_timestamp') as string

    const guild: Guild = {
        id,
        name,
        faction,
        realm,
        achievement_points: Number(achievement_points)?? 0,
        member_count: Number(member_count) ?? 0,
        created_timestamp: new Date(created_timestamp).getTime() ?? Date.now()
    };

    let response = await fetch(`${PUBLIC_API_URL}/Guild/`, {
        method: 'POST', body: JSON.stringify(guild), headers: {
            'Content-Type': 'application/json'
        },
    })
    if (id == 0) {
        let data = await response.json();
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
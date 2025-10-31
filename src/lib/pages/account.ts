import { PUBLIC_API_URL } from '$env/static/public';
import { getHash } from '$lib/helper/hash';
import type { Account, AccountLogin } from '$lib/types';

export async function handleAccountSubmit(formData: FormData) {
    const name = formData.get('name') as string
    const password = formData.get('password') as string
    const level = formData.get('level') as string
    const guild = formData.get('guild') as string

    const account: Account = {
        username: name,
        hash: await getHash(name.toLowerCase(),password),
        level : Number(level),
        guild : Number(guild ?? -1),
        creation_time: Date.now()
    };

    const response = await fetch(`${PUBLIC_API_URL}/Account/Register`, {
        method: 'POST', body: JSON.stringify(account), headers: {
            'Content-Type': 'application/json'
        },
    })

    return await response
}

export async function handleAccountLogin(formData: FormData) {
    const name = formData.get('name') as string
    const password = formData.get('password') as string

    const account: AccountLogin = {
        username: name,
        hash: await getHash(name.toLowerCase(),password)
    };

    const response = await fetch(`${PUBLIC_API_URL}/Account/Login`, {
        method: 'POST', body: JSON.stringify(account), headers: {
            'Content-Type': 'application/json'
        },
    })

    return await response
}
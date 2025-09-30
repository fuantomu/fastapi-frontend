import { PUBLIC_API_URL } from '$env/static/public';
import type { Ingredient } from '$lib/types';

export async function handleIngredientSubmit(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const alias = formData.getAll('alias_name') as string[];

    const ingredient: Ingredient = {
        id,
        name,
        description,
        alias
    };

    await fetch(`${PUBLIC_API_URL}/Ingredient/?overwrite_alias=true`, {
        method: 'POST', body: JSON.stringify(ingredient), headers: {
            'Content-Type': 'application/json'
        },
    })
    return `/ingredients/${id}`
}

export async function handleIngredientDelete(formData: FormData) {
    const id = formData.get('id') as string

    await fetch(`${PUBLIC_API_URL}/Ingredient/?id=${id}`, {
        method: 'DELETE',
    })
}
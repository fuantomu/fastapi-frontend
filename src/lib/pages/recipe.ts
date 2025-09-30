import { PUBLIC_API_URL } from '$env/static/public';
import type { Recipe, RecipeIngredient } from '$lib/types';

export async function handleRecipeSubmit(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const ingredientNames = formData.getAll('ingredient_name') as string[];
    const ingredientQuantities = formData.getAll('ingredient_quantity') as string[];
    const ingredients: RecipeIngredient[] = ingredientNames.map((name, index) => ({
        name,
        quantity: ingredientQuantities[index]
    }));

    const recipe: Recipe = {
        id,
        name,
        description,
        ingredients
    };

    await fetch(`${PUBLIC_API_URL}/Recipe/?overwrite_ingredients=true`, {
        method: 'POST', body: JSON.stringify(recipe), headers: {
            'Content-Type': 'application/json'
        },
    })
    return `/recipes/${id}`
}

export async function handleRecipeDelete(formData: FormData) {
    const id = formData.get('id') as string

    await fetch(`${PUBLIC_API_URL}/Recipe/?id=${id}`, {
        method: 'DELETE',
    })
}
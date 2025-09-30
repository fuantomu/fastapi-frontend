import { handleRecipeDelete } from '$lib/pages/recipe';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    console.log(data);
    await handleRecipeDelete(data);
    throw redirect(303, '/recipes');
  }
};
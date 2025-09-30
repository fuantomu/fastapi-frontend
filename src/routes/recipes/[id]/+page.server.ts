import { handleRecipeSubmit } from '$lib/pages/recipe';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result = await handleRecipeSubmit(data);
    throw redirect(303, result)
  }
};
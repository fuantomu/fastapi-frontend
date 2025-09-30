import { handleIngredientSubmit } from '$lib/pages/ingredient';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result = await handleIngredientSubmit(data);
    throw redirect(303, result)
  }
};
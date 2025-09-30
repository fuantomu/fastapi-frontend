import { handleIngredientDelete } from '$lib/pages/ingredient';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    await handleIngredientDelete(data);
    throw redirect(303, '/ingredients');
  }
};
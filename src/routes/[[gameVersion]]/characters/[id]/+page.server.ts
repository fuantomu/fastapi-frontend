import { handleCharacterSubmit } from '$lib/pages/character';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result = await handleCharacterSubmit(data);
    throw redirect(303, result)
  }
};
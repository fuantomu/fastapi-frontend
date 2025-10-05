import { handleCharacterDelete } from '$lib/pages/character';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    await handleCharacterDelete(data);
    throw redirect(303, `/${data.get('gameVersion')}/characters`);
  }
};
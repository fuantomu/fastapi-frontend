import { handleCharacterSubmit } from '$lib/pages/character';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result: string = await handleCharacterSubmit(data);
    throw redirect(303, `/${data.get('gameVersion')}${result}`)
  }
};
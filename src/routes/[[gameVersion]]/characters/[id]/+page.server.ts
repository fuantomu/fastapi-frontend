import { handleCharacterSubmit } from '$lib/pages/character';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result = await handleCharacterSubmit(data);
    console.log(data,result)
    const gameVersion = data.get("version")
    throw redirect(303, `/${gameVersion}${result}`)
  }
};
import { handleCharacterSubmit } from '$lib/pages/character';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result: string = await handleCharacterSubmit(data);
    console.log(data,result)
    throw redirect(303, `/${data.get('version')}${result}`)
  }
};
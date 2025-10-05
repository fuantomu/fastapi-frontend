import { handleGuildSubmit } from '$lib/pages/guild';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result = await handleGuildSubmit(data);
    throw redirect(303, `/${data.get('gameVersion')}${result}`)
  }
};
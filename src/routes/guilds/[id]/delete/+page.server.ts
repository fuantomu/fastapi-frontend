import { handleGuildDelete  } from '$lib/pages/guild';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    await handleGuildDelete(data);
    throw redirect(303, '/guilds');
  }
};
import { handleAccountUpdateSubmit } from '$lib/pages/account';
import { type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    await handleAccountUpdateSubmit(data);
  }
};
import { handleAccountSubmit } from '$lib/pages/account';
import { type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const response = await handleAccountSubmit(data);
    const result = await response.json()
    return {status: response.status, msg : result["Result"]}
  }
};
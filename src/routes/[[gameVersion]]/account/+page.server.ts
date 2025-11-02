import { handleAccountLogin, handleAccountSubmit } from '$lib/pages/account';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  register: async ({ request }) => {
    const data = await request.formData();
    console.log(data)

    const response = await handleAccountSubmit(data);
    const status = response.status
    
    if (status === 400){
      const out = await response.json()
      return fail(422, {
				error: out["Result"]
			});
    }
    return { success: true, created: true }

  },
  login: async ({ request }) => {
    const data = await request.formData();
    const response = await handleAccountLogin(data);
    const status = response.status
    
    if (status === 400){
      const out = await response.json()
      return fail(422, {
				error: out["Result"]
			});
    }
    const out = await response.json()
    return { success: true, session: out["Result"]["session"], username: data.get("name"), timeout: out["Result"]["timeout"] }
  }
};
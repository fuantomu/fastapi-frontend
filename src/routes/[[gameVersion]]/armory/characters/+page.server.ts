import { handleCharacterSearch } from "$lib/pages/character";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  search: async ({ request }) => {
    const data = await request.formData();
    const response = await handleCharacterSearch(data)
    const status = response.status

    const out = await response.json()
    if (status === 404) {

      return fail(422, {
        error: out["Result"]
      });
    }
    return { success: true, character: out["Result"] }

  }
};
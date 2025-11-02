import type { PageLoad } from './$types';


export const load: PageLoad = async ({ params }) => {
    try {
        return params

    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }
};
import type { PageLoad } from './$types';


export const load: PageLoad = async ({ params }) => {
    try {
        const { id } = params;
        return {
            id
        };

    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err }
    }
};
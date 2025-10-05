import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    try {
        return {  }
    } catch (err) {
        window.location.href = "/";
    }
};
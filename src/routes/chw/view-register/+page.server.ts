import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const res = await fetch('https://api.megaflips.com/api/v1/mothers');
        const mothers = await res.json();
        return { mothers };
    } catch (err) {
        return { mothers: [] };
    }
};
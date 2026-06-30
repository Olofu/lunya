// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const role = cookies.get('user_role');
    const path = url.pathname;

    return {
        role,
        path
    };
};
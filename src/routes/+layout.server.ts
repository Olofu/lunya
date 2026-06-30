import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const role = cookies.get('user_role');
    const path = url.pathname;

    // 1. Allow login page access
    if (path === '/login') return { role };

    // 2. Redirect to login if no role exists
    if (!role) {
        throw redirect(303, '/login');
    }

    // 3. Role-based protection
    if (role === 'admin' && path.startsWith('/chw')) {
        throw redirect(303, '/admin/dashboard');
    }
    if (role === 'chw' && path.startsWith('/admin')) {
        throw redirect(303, '/chw/register');
    }

    return { role };
};
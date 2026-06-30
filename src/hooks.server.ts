/*/ src/hooks.server.js
import { redirect } from '@sveltejs/kit';

// @type {import('@sveltejs/kit').Handle} /
export async function handle({ event, resolve }) {
    const { url, cookies } = event;

    // 1. Protect the dashboard routes
    if (url.pathname.startsWith('/dashboard')) {
        const sessionToken = cookies.get('session_token');

        // If no token exists, redirect immediately to login or root
        if (!sessionToken) {
            throw redirect(303, '/login');
        }

        // Optional: Perform a quick verification check against your auth engine
        const isValid = await verifySession(sessionToken);
        if (!isValid) {
            cookies.delete('session_token', { path: '/' });
            throw redirect(303, '/login');
        }
    }

    // 2. Proceed with the request if authorized
    return await resolve(event);
}

async function verifySession(token) {
    // Implement your internal JWT or database verification token logic here
    return token === 'valid-secure-token'; 
}

*/


import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    const { url, cookies } = event;
    const sessionToken = cookies.get('session_token');
    const userRole = cookies.get('user_role');

    // 1. PUBLIC ROUTES: Allow access to login or static pages
    if (url.pathname === '/login' || url.pathname === '/') {
        return await resolve(event);
    }

    // 2. AUTHENTICATION CHECK: If no token, bounce to login
    if (!sessionToken) {
        throw redirect(303, '/login');
    }

    // 3. ROLE-BASED ACCESS CONTROL (RBAC)
    // Prevent Admins from accessing CHW pages
    if (url.pathname.startsWith('/chw') && userRole !== 'chw') {
        throw redirect(303, '/admin/dashboard');
    }

    // Prevent CHWs from accessing Admin pages
    if (url.pathname.startsWith('/admin') && userRole !== 'admin') {
        throw redirect(303, '/chw/register');
    }

    // 4. Proceed with the request
    return await resolve(event);
}
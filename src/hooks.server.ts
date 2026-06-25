// src/hooks.server.js
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
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
// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    // If the operator already has a valid session, bypass login and go straight to dashboard
    const sessionToken = cookies.get('session_token');
    if (sessionToken === 'valid-secure-token') {
        throw redirect(303, '/dashboard');
    }
    return {};
};

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const username = data.get('username')?.toString();
        const password = data.get('password')?.toString();

        // 1. Simple validation check
        if (!username || !password) {
            return fail(400, { message: 'Missing operator credentials.' });
        }

        // 2. Credential verification (Replace with your actual auth layer / db check)
        if (username === 'admin' && password === 'password123') {
            
            // 3. Set the secure session cookie
            cookies.set('session_token', 'valid-secure-token', {
                path: '/',
                httpOnly: true, // Prevents client-side JS keylogging/XSS access
                secure: true,   // Forces HTTPS at the Cloudflare edge
                sameSite: 'strict', // Mitigates CSRF vulnerabilities
                maxAge: 60 * 60 * 12 // Session expires in 12 hours
            });

            // Redirect securely to the command centre
            throw redirect(303, '/dashboard');
        }

        return fail(401, { message: 'Invalid operator signature or access token.' });
    }
};
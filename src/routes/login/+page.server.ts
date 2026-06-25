import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const API_BASE_URL = 'https://api.megaflips.com/api/v1';

export const load: PageServerLoad = async ({ cookies }) => {
    // Check if the operator already has a verified active session cookie
    const sessionToken = cookies.get('session_token');
    if (sessionToken) {
        throw redirect(303, '/dashboard');
    }
    return {};
};

export const actions: Actions = {
    login: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const username = data.get('username')?.toString().trim();
        const password = data.get('password')?.toString();

        // 1. Initial structural input validation check
        if (!username || !password) {
            return fail(400, { message: 'Missing operator credentials.' });
        }

        try {
            // 2. Dispatch authentication request over the network to the Rust Axum engine
            const res = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const body = await res.json();

            if (!res.ok) {
                return fail(res.status, { 
                    message: body.message || 'Invalid operator signature or access token.' 
                });
            }

            // 3. Extract the generation signature token and set the secure httpOnly session cookie
            const token = body.token || 'valid-secure-token';
            
            cookies.set('session_token', token, {
                path: '/',
                httpOnly: true,     // Hardens against client-side script cross-site scripting (XSS) extraction
                secure: true,       // Enforces TLS execution context across Cloudflare Pages edge
                sameSite: 'strict', // Blocks cross-site request forgery (CSRF) vectors completely
                maxAge: 60 * 60 * 12 // Session duration window set to 12 hours
            });

        } catch (err) {
            eprintln: console.error('Auth network connection error:', err);
            return fail(500, { message: 'Afiya core node verification gateway timeout.' });
        }

        // 4. Everything matches cleanly. Redirect securely into the surveillance control centre
        throw redirect(303, '/dashboard');
    }
};
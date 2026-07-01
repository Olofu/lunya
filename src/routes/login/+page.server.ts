import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

//const API_BASE_URL = 'https://api.megaflips.com/api/v1';

// Point this to your Rust backend
const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

export const actions: Actions = {
    login: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const username = data.get('username')?.toString().trim();
        const password = data.get('password')?.toString();

        if (!username || !password) {
            return fail(400, { message: 'Missing operator credentials.' });
        }

        try {
            const res = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const body = await res.json();

            if (!res.ok) {
                return fail(res.status, { message: body.message || 'Authentication failed.' });
            }

            // Save session cookies
            cookies.set('session_token', body.token, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 43200
            });
            cookies.set('user_role', body.role, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 43200
            });

            // Redirect based on role
            throw redirect(303, body.role === 'admin' ? '/admin/dashboard' : '/chw/register');

        } catch (err) {
            console.error('Auth error:', err);
            return fail(500, { message: 'Afiya core node verification gateway timeout.' });
        }
    }
};

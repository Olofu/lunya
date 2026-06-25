import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// 💡 Changed this to hit the server's correct base domain (or http://127.0.0.1:8080 if debugging locally on the VPS)
const API_BASE_URL = 'https://api.megaflips.com/api/v1'; 

export const load: PageServerLoad = async ({ cookies }) => {
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

        if (!username || !password) {
            return fail(400, { message: 'Missing operator credentials.' });
        }

        try {
            // 💡 Because API_BASE_URL handles /api/v1, we change this to /admin/login 
            // to perfectly match the backend path: "/api/v1/admin/login"
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

            const token = body.token || 'valid-secure-token';
            
            cookies.set('session_token', token, {
                path: '/',
                httpOnly: true,     
                secure: true,       
                sameSite: 'strict', 
                maxAge: 60 * 60 * 12 
            });

        } catch (err) {
            console.error('Auth network connection error:', err);
            return fail(500, { message: 'Afiya core node verification gateway timeout.' });
        }

        throw redirect(303, '/dashboard');
    }
};
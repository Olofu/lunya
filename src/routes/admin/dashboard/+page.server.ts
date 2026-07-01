import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// Centralize your verified production API endpoint 
const API_BASE_URL = 'https://api.megaflips.com/api/v1';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    // 🛡️ 1. Security Session Guard Gate
    const sessionToken = cookies.get('session_token');
    if (!sessionToken) {
        throw redirect(302, '/login');
    }

    try {
        // Dispatch data lookup request out to your backend server
        const response = await fetch(`${API_BASE_URL}/internal/critical-nodes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return { encounters: [] };
        
        const criticalEncounters = await response.json();
        return { encounters: criticalEncounters || [] };

    } catch (err) {
        console.error("Failed to fetch graph ledger from edge cluster:", err);
        return { encounters: [] };
    }
};

export const actions: Actions = {
    intakeNode: async ({ request, cookies, fetch }) => {
        // 🛡️ Security Check: Ensure action cannot be triggered by unauthenticated CSRF context
        const sessionToken = cookies.get('session_token');
        if (!sessionToken) {
            return fail(401, { message: "Unauthorized operator transaction blocked." });
        }

        const formData = await request.formData();
        const inputDigits = formData.get('inputDigits')?.toString();
        
        // Server-side validation check
        if (!inputDigits || !inputDigits.trim()) {
            return fail(400, { message: "Console payload cannot be empty." });
        }

        try {
            // Forward manual entry console payload up to your live Axum webhook system handler
            const res = await fetch(`${API_BASE_URL}/webhook/intake`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`
                },
                body: JSON.stringify({
                    phone_hash: `manual_entry_${Math.random().toString(36).substring(2, 10)}`,
                    input_digits: inputDigits,
                    symptoms: ["manual_triage_checkpoint"],
                    epds_score: 0
                })
            });

            if (!res.ok) {
                return fail(res.status, { message: "Server rejected payload verification." });
            }

            return { success: true, message: "Node data successfully dispatched to backend engine." };
        } catch (err) {
            return fail(500, { message: "Network error: Could not reach edge api cluster." });
        }
    }
};
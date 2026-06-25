import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ platform, fetch }) => {
    const backendUrl = platform?.env?.INTERNAL_API_URL || 'https://api.megaflips.com';
    const secretKey = platform?.env?.API_SECRET_KEY;

    try {
        const response = await fetch(`${backendUrl}/api/v1/internal/critical-nodes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
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
    intakeNode: async ({ request, platform, fetch }) => {
        const formData = await request.formData();
        const inputDigits = formData.get('inputDigits')?.toString();
        
        // 1. Server-side validation
        if (!inputDigits || !inputDigits.trim()) {
            return fail(400, { message: "Console payload cannot be empty." });
        }

        const backendUrl = platform?.env?.INTERNAL_API_URL || 'https://api.megaflips.com';
        const secretKey = platform?.env?.API_SECRET_KEY;

        try {
            // 2. Safe server-to-server request
            const res = await fetch(`${backendUrl}/api/v1/webhook/intake`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${secretKey}` // Protected behind your edge worker!
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
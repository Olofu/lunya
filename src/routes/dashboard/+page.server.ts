import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform }) => {
    // Pull the configuration variables securely from Cloudflare Edge Workers environment variables
    const backendUrl = platform?.env?.INTERNAL_API_URL || 'https://api.megaflips.com';
    const secretKey = platform?.env?.API_SECRET_KEY;

    try {
        // Fetch raw graph data from the backend internal surveillance endpoint
        const response = await fetch(`${backendUrl}/api/v1/internal/critical-nodes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return { encounters: [] };
        }

        const criticalEncounters = await response.json();
        return {
            encounters: criticalEncounters || []
        };
    } catch (err) {
        console.error("Failed to fetch graph ledger from edge cluster:", err);
        return { encounters: [] };
    }
};
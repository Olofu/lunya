import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

const API_BASE_URL = 'https://api.megaflips.com/api/v1';

export const actions: Actions = {
    createChw: async ({ request, fetch }) => {
        const fd = await request.formData();
        const payload = {
            first_name: fd.get('first_name'),
            last_name: fd.get('last_name'),
            designation: fd.get('designation'),
            state: fd.get('state'), // Captured from hidden input
            lga: fd.get('lga'),
            ward: fd.get('ward'),
            hospital: fd.get('hospital'),
        };

        const res = await fetch(`${API_BASE_URL}/admin/chw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) return fail(res.status, { success: false, message: data.message });
        return { success: true, message: `Provisioned: ${data.userid}` };
    },

    createPatient: async ({ request, fetch }) => {
        const fd = await request.formData();
        const payload = {
            phone_hash: fd.get('phone_hash'),
            full_name: fd.get('full_name'),
            state: fd.get('state'), // Captured from hidden input
            lga: fd.get('lga'),
            ward: fd.get('ward'),
        };

        const res = await fetch(`${API_BASE_URL}/admin/patient`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) return fail(res.status, { success: false, message: data.message });
        return { success: true, message: 'Registry entry created.', generatedToken: data.generated_token };
    }
};
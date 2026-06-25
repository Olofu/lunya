import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
    createChw: async ({ request }) => {
        const formData = await request.formData();
        
        // Extract field mappings cleanly
        const chwPayload = {
            userid: formData.get('userid'),
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            middle_name: formData.get('middle_name') || null,
            designation: formData.get('designation'),
            rank: formData.get('rank'),
            department: formData.get('department'),
            state: 'Sokoto',
            lga: formData.get('lga'),
            town: formData.get('town'),
            ward: formData.get('ward'),
            hospital: formData.get('hospital'),
        };

        try {
            // Forward network request payload up to your local Axum instance
            const res = await fetch('http://127.0.0.1:8080/api/v1/admin/chw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chwPayload)
            });

            const data = await res.json();

            if (!res.ok) {
                return fail(res.status, { success: false, message: data.message || 'Node rejected provisioning.' });
            }

            return { success: true, message: data.message };
        } catch (err) {
            return fail(500, { success: false, message: 'Afiya core node communication failure.' });
        }
    },

    createPatient: async ({ request }) => {
        const formData = await request.formData();
        
        const patientPayload = {
            phone_hash: formData.get('phone_hash'),
            full_name: formData.get('full_name'),
            age: parseInt(formData.get('age') as string, 10),
            photo: formData.get('photo') || null,
            state: 'Sokoto',
            lga: formData.get('lga'),
            town: formData.get('town'),
            ward: formData.get('ward'),
        };

        try {
            const res = await fetch('http://127.0.0.1:8080/api/v1/admin/patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientPayload)
            });

            const data = await res.json();

            if (!res.ok) {
                return fail(res.status, { success: false, message: data.message || 'Registry creation rejected.' });
            }

            // Return the generated passcode token down to the UI layout
            return { 
                success: true, 
                message: data.message, 
                generatedToken: data.generated_token 
            };
        } catch (err) {
            return fail(500, { success: false, message: 'Afiya core node communication failure.' });
        }
    }
};
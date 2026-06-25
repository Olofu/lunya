import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

const API_BASE_URL = 'https://api.megaflips.com/api/v1';

export const actions: Actions = {

    createChw: async ({ request, fetch }) => {
        const formData = await request.formData();
        const wardValue = formData.get('ward')?.toString() || '';

        // 💡 REMOVED 'userid' because the backend generates it now
        const chwPayload = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            middle_name: formData.get('middle_name') || null,
            designation: formData.get('designation'),
            rank: formData.get('rank'),
            department: formData.get('department'),
            state: 'Sokoto',
            lga: formData.get('lga'),
            town: wardValue, 
            ward: wardValue,
            hospital: formData.get('hospital'),
        };

        try {
            const res = await fetch(`${API_BASE_URL}/admin/chw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chwPayload)
            });

            const data = await res.json();

            if (!res.ok) {
                return fail(res.status, { success: false, message: data.message || 'Provisioning failed.' });
            }

            // 💡 SUCCESS: Now you can return the generated ID from the backend
            return { 
                success: true, 
                message: `Operator provisioned successfully. ID: ${data.userid}` 
            };
        } catch (err) {
            console.error("Axum Dispatch Failure:", err);
            return fail(500, { success: false, message: 'Core node unreachable.' });
        }
    },

    createPatient: async ({ request, fetch }) => {
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
            const res = await fetch(`${API_BASE_URL}/admin/patient`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientPayload)
            });

            const data = await res.json();

            if (!res.ok) {
                return fail(res.status, { success: false, message: data.message || 'Registry creation rejected.' });
            }

            return { 
                success: true, 
                message: data.message, 
                generatedToken: data.generated_token 
            };
        } catch (err) {
            // THIS WILL LOG TO YOUR BROWSER TERMINAL/SERVER CONSOLE
    console.error("DEBUG: Detailed Fetch Error:", err); 
    
            return fail(500, { success: false, message: 'Afiya core node communication failure. Node unreachable (Check CORS/WAF)' });
        }
    }
};
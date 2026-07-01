import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

const API_BASE_URL = 'https://api.megaflips.com/api/v1';

export const actions: Actions = {

    createChw: async ({ request, fetch }) => {
        const formData = await request.formData();
        
        // Map form fields to your backend structure
        const chwPayload = {
            first_name: formData.get('first_name')?.toString() || '',
            last_name: formData.get('last_name')?.toString() || '',
            middle_name: formData.get('middle_name')?.toString() || null,
            designation: formData.get('designation')?.toString() || '',
            rank: formData.get('rank')?.toString() || '',
            department: formData.get('department')?.toString() || '',
            state: formData.get('stated')?.toString() || '',
            lga: formData.get('lga')?.toString() || '',
            town: formData.get('town')?.toString() || '',
            ward: formData.get('ward')?.toString() || '',
            hospital: formData.get('hospital')?.toString() || '',
            userid: "" // Backend generates this
        };

        try {
            const res = await fetch(`${API_BASE_URL}/admin/chw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chwPayload)
            });

            const data = await res.json();

            if (!res.ok) {
                return fail(res.status, { 
                    success: false, 
                    message: data.error || 'Provisioning failed.' 
                });
            }

            return { 
                success: true, 
                message: `Operator provisioned successfully. ID: ${data.userid}` 
            };
        } catch (err) {
            return fail(500, { success: false, message: 'Afiya core node unreachable.' });
        }
    }
,

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
            const res = await fetch(`${API_BASE_URL}/chw/register`, {
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
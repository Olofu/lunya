import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

const API_BASE_URL = 'https://api.megaflips.com/api/v1';

export const actions: Actions = {

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
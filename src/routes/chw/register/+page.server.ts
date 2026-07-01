import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

const API_BASE_URL = 'https://api.megaflips.com/api/v1';

export const actions: Actions = {
  createPatient: async ({ request, fetch, locals }) => {
    const formData = await request.formData();

    // raw phone from form
    const rawPhone = formData.get('phone') as string;

    // build payload
    const patientPayload = {
      phone_hash: rawPhone,
      phone: formData.get('phone'), // or compute hash here if needed
      full_name: formData.get('full_name'),
      age: parseInt(formData.get('age') as string, 10),
      photo: formData.get('photo') || null,
      state: 'Sokoto',
      lga: formData.get('lga'),
      town: formData.get('town'),
      ward: formData.get('ward'),
      // attach CHW id from session/JWT
      chw_id: locals.user?.userid || '',
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
        secret_id: data.secret_id, // backend returns LunyaN
        generatedToken: data.generated_token
      };
    } catch (err) {
      console.error("DEBUG: Detailed Fetch Error:", err);
      return fail(500, { success: false, message: 'Afiya core node communication failure. Node unreachable (Check CORS/WAF)' });
    }
  }
};


       
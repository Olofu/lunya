<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData, PageData } from './$types';

    let { form, data }: { form: ActionData, data: PageData } = $props();

    let activeTab = $state('chw');
    let isProvisioning = $state(false);
    let isRegistering = $state(false);

    const sokotoLgas = [
        "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", 
        "Illela", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", 
        "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", 
        "Wurno", "Yabo"
    ];

    function copyToken(token: string) {
        navigator.clipboard.writeText(token);
        alert('Token copied to clipboard');
    }
</script>

<main class="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
    <header class="border-b border-slate-800 bg-slate-950/50 backdrop-blur px-8 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-3">
            <div class="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <h1 class="text-xl font-bold tracking-wider uppercase text-emerald-400">Afiya Control Infrastructure</h1>
        </div>
    </header>

    <div class="max-w-6xl mx-auto p-6 lg:p-8">
        <div class="flex border-b border-slate-800 mb-8 space-x-4">
            <button class="pb-3 text-sm font-semibold uppercase {activeTab === 'chw' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}" onclick={() => activeTab = 'chw'}>Provision CHW</button>
            <button class="pb-3 text-sm font-semibold uppercase {activeTab === 'patients' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}" onclick={() => activeTab = 'patients'}>Mother Registry</button>
        </div>

        {#if form?.message}
            <div class="mb-6 p-4 rounded-lg bg-slate-950 border {form.success ? 'border-emerald-500/30 text-emerald-300' : 'border-rose-500/30 text-rose-300'} text-sm">
                {form.message}
            </div>
        {/if}

        {#if form?.generatedToken}
            <div class="mb-6 p-6 rounded-lg bg-emerald-950/40 border-2 border-dashed border-emerald-500 text-center cursor-pointer hover:bg-emerald-950/60 transition" onclick={() => copyToken(form!.generatedToken!)}>
                <span class="block text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">Generated Access Passcode (Click to Copy)</span>
                <span class="text-4xl font-mono tracking-widest font-black text-white">{form.generatedToken}</span>
            </div>
        {/if}

        {#if activeTab === 'chw'}
            <section class="bg-slate-950/40 border border-slate-800 rounded-xl p-6">
                <form method="POST" action="?/createChw" use:enhance={() => {
                    isProvisioning = true;
                    return async ({ update }) => {
                        isProvisioning = false;
                        await update({ reset: true });
                    };
                }} class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input type="hidden" name="state" value="Sokoto" />
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">First Name</label><input type="text" name="first_name" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white" /></div>
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">Last Name</label><input type="text" name="last_name" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white" /></div>
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">Designation</label><select name="designation" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white"><option>CHEW</option><option>Midwife</option></select></div>
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">LGA</label><select name="lga" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white">{#each sokotoLgas as lga}<option value={lga}>{lga}</option>{/each}</select></div>
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">Ward/Town</label><input type="text" name="ward" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white" /></div>
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">PHC Clinic</label><input type="text" name="hospital" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white" /></div>
                    <div class="md:col-span-3"><button type="submit" disabled={isProvisioning} class="w-full bg-emerald-500 py-3 rounded-lg font-bold text-slate-950">{isProvisioning ? 'Provisioning...' : 'Provision Operator'}</button></div>
                </form>
            </section>
        {/if}

        {#if activeTab === 'patients'}
            <section class="bg-slate-950/40 border border-slate-800 rounded-xl p-6">
                <form method="POST" action="?/createPatient" use:enhance={() => {
                    isRegistering = true;
                    return async ({ update }) => {
                        isRegistering = false;
                        await update({ reset: true });
                    };
                }} class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="hidden" name="state" value="Sokoto" />
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">Phone Hash</label><input type="text" name="phone_hash" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white font-mono" /></div>
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">Full Name</label><input type="text" name="full_name" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white" /></div>
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">LGA</label><select name="lga" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white">{#each sokotoLgas as lga}<option value={lga}>{lga}</option>{/each}</select></div>
                    <div><label class="block text-xs uppercase font-bold text-slate-400 mb-2">Ward</label><input type="text" name="ward" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white" /></div>
                    <div class="md:col-span-2"><button type="submit" disabled={isRegistering} class="w-full bg-emerald-500 py-3 rounded-lg font-bold text-slate-950">{isRegistering ? 'Registering...' : 'Register Profile'}</button></div>
                </form>
            </section>
        {/if}
    </div>
</main>
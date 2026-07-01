<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData, PageData } from './$types';

    let { form, data }: { form: ActionData, data: PageData } = $props();

    let activeTab = $state('chw');
    let isSubmitting = $state(false);

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
          <!--  <button class="pb-3 text-sm font-semibold uppercase {activeTab === 'chw' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}" onclick={() => activeTab = 'chw'}>
                Provision CHW Operator
            </button>-->
            <button class="pb-3 text-sm font-semibold uppercase {activeTab === 'patients' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}" onclick={() => activeTab = 'patients'}>
                Register Mother Registry
            </button>
        </div>

        {#if form?.message}
            <div class="mb-6 p-4 rounded-lg bg-slate-950 border {form.success ? 'border-emerald-500/30 text-emerald-300' : 'border-rose-500/30 text-rose-300'} text-sm">
                {form.message}
            </div>
        {/if}

        {#if form?.generatedToken}
            <div class="mb-6 p-6 rounded-lg bg-emerald-950/40 border-2 border-dashed border-emerald-500 text-center cursor-pointer hover:bg-emerald-950/60 transition" onclick={() => copyToken(form!.generatedToken!)}>
                <span class="block text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">Generated Patient Access Passcode (Click to Copy)</span>
                <span class="text-4xl font-mono tracking-widest font-black text-white">{form.generatedToken}</span>
            </div>
        {/if}

        {#if activeTab === 'chw'}
            <section class="bg-slate-950/40 border border-slate-800 rounded-xl p-6">
                <h2 class="text-lg font-bold text-white mb-6">Create Community Health Worker Account</h2>
                <form method="POST" action="?/createChw" use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        isSubmitting = false;
                        await update({ reset: true });
                    };
                }} class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">First Name</label>
                        <input type="text" name="first_name" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Last Name</label>
                        <input type="text" name="last_name" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Middle Name</label>
                        <input type="text" name="middle_name" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Designation</label>
                        <select name="designation" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                            <option value="CHEW">CHEW Officer</option>
                            <option value="Midwife">Registered Midwife</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Rank</label>
                        <input type="text" name="rank" value="Senior" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div class="md:col-span-3 pt-4 border-t border-slate-800">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Regional Deployment Metrics</h3>
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">State</label>
                        <input type="text" value="Sokoto State, Nigeria" disabled class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed" />
                        <input type="hidden" name="stated" value="Sokoto" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">LGA</label>
                        <select name="lga" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                            <option value="" disabled selected>Select LGA</option>
                            {#each sokotoLgas as lga}
                                <option value={lga}>{lga}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2"> Town</label>
                        <input type="text" name="town" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                     <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Ward </label>
                        <input type="text" name="ward" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div class="md:col-span-3">
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Assigned PHC Clinic or Hospital</label>
                        <input type="text" name="hospital" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div class="md:col-span-3 flex justify-end pt-4">
                        <button type="submit" disabled={isSubmitting} class="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3 rounded-lg transition disabled:opacity-50">
                            {isSubmitting ? 'Registering...' : 'Provision Operator Node'}
                        </button>
                    </div>
                </form>
            </section>
        {/if}

        {#if activeTab === 'patients'}
            <section class="bg-slate-950/40 border border-slate-800 rounded-xl p-6">
                <h2 class="text-lg font-bold text-white mb-6">Register Mother Record Registry</h2>
                <form method="POST" action="?/createPatient" use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        isSubmitting = false;
                        await update({ reset: true });
                    };
                }} class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Secure Phone Hash Identifier</label>
                        <input type="text" name="phone_hash" required autocomplete="off" placeholder="Enter SHA-256 Hash" class="w-full font-mono bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Full Name</label>
                        <input type="text" name="full_name" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Age</label>
                        <input type="number" name="age" min="1" max="120" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Photo Base64 URL (Optional)</label>
                        <input type="text" name="photo" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs font-mono" />
                    </div>
                    <div class="md:col-span-2 pt-4 border-t border-slate-800">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Demographic Registry</h3>
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">LGA</label>
                        <select name="lga" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                            <option value="" disabled selected>Select LGA</option>
                            {#each sokotoLgas as lga}
                                <option value={lga}>{lga}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Town / Settlement</label>
                        <input type="text" name="town" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs uppercase font-bold text-slate-400 mb-2">Ward</label>
                        <input type="text" name="ward" required class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div class="md:col-span-2 flex justify-end pt-4">
                        <button type="submit" disabled={isSubmitting} class="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3 rounded-lg transition disabled:opacity-50">
                            {isSubmitting ? 'Processing...' : 'Register Profile & Compile Token'}
                        </button>
                    </div>
                </form>
            </section>
        {/if}
    </div>
</main>
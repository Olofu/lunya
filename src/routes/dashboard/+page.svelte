<script lang="ts">
//    export let data;
    

    // Local reactive states for manual node submission/checks
    let inputCode = "";
    let isSubmitting = false;
    let feedbackMessage = "";

    let { data } = $props();

    async function handleManualSubmit() {
        if (!inputCode.trim()) return;
        isSubmitting = true;
        feedbackMessage = "";

        try {
            // Drop a network hook directly to your production API engine
            const res = await fetch(`https://api.megaflips.com/api/v1/webhook/intake`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone_hash: `manual_entry_${Math.random().toString(36).substring(2, 10)}`,
                    input_digits: inputCode,
                    symptoms: ["manual_triage_checkpoint"],
                    epds_score: 0
                })
            });

            if (res.ok) {
                feedbackMessage = "Node data successfully dispatched to backend engine.";
                inputCode = "";
                // Note: In production, you'd trigger an invalidateAll() here to refresh data.
            } else {
                feedbackMessage = "Server rejected payload verification.";
            }
        } catch (err) {
            feedbackMessage = "Network error: Could not reach edge api cluster.";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<main class="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans">
    <header class="border-b border-slate-800 pb-6 mb-8">
        <div class="flex items-center space-x-3">
            <span class="h-4 w-4 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 class="text-2xl font-bold tracking-tight">Lunya · Surveillance Command Centre</h1>
        </div>
        <p class="text-sm text-slate-400 mt-1">Real-time localized postpartum intervention and emergency monitoring metrics.</p>
    </header>

    <!-- MANUAL ENTRY CONSOLE BAR -->
    <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Manual System Input Console</h2>
        <form on:submit|preventDefault={handleManualSubmit} class="flex flex-col sm:flex-row gap-4">
            <input 
                type="text" 
                bind:value={inputCode} 
                placeholder="Enter patient triage digits or diagnostic encounter token..." 
                disabled={isSubmitting}
                class="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
            />
            <button 
                type="submit" 
                disabled={isSubmitting}
                class="bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
                {isSubmitting ? "Processing..." : "Process Code"}
            </button>
        </form>
        {#if feedbackMessage}
            <p class="text-xs text-orange-400 mt-3 font-medium animate-fade-in">{feedbackMessage}</p>
        {/if}
    </section>

    <!-- METRICS GRID -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Scaling Threshold</h3>
            <p class="text-4xl font-extrabold text-orange-500 mt-2">50,000+</p>
            <span class="text-xs text-slate-500 block mt-1">Expected 18-month performance span</span>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Monitored Base Nodes</h3>
            <p class="text-4xl font-extrabold text-white mt-2">{data.encounters.length}</p>
            <span class="text-xs text-slate-500 block mt-1">Active sync connections verified</span>
        </div>
    </section>

    <!-- DATA QUEUE TABLE -->
    <section class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div class="p-6 border-b border-slate-800">
            <h2 class="text-lg font-bold">Active High-Risk Triage Queue</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-950 text-slate-400 text-xs font-semibold uppercase border-b border-slate-800">
                        <th class="p-4">Anonymized Patient Hash</th>
                        <th class="p-4">Risk Metric</th>
                        <th class="p-4">EPDS Target</th>
                        <th class="p-4">Logged Corridor Time</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-sm">
                    {#each data.encounters as item}
                        <tr class="hover:bg-slate-850 transition-colors">
                            <td class="p-4 font-mono text-xs text-slate-300">{item.phone_hash.substring(0, 16)}...</td>
                            <td class="p-4">
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-red-950 text-red-400 border border-red-800">
                                    {item.computed_risk}
                                </span>
                            </td>
                            <td class="p-4 font-semibold">{item.epds_score} / 30</td>
                            <td class="p-4 text-slate-400">{new Date(item.logged_at).toLocaleString()}</td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="4" class="p-8 text-center text-slate-500 italic">
                                Zero urgent high-risk anomalies logged across regional corridors within past runtime windows.
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>
</main>
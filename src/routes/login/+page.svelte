<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';

    let { form }: { form: ActionData } = $props();
    let isSubmitting = $state(false);
</script>

<main class="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <header class="text-center mb-8">
            <div class="inline-flex items-center space-x-2 mb-2">
                <span class="h-3 w-3 rounded-full bg-orange-500 animate-pulse"></span>
                <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Secure Gateway</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-white">Lunya Command Access</h1>
            <p class="text-xs text-slate-500 mt-1">Authorization required to access surveillance data grids.</p>
        </header>

        <form 
            method="POST" 
            action="?/login"
            use:enhance={() => {
                isSubmitting = true;
                return async ({ update }) => {
                    await update();
                    isSubmitting = false;
                };
            }}
            class="space-y-5"
        >
            <div>
                <label for="username" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Operator Identity</label>
                <input 
                    type="text" 
                    name="username" 
                    id="username"
                    required
                    disabled={isSubmitting}
                    placeholder="Enter identity token..."
                    class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
                />
            </div>

            <div>
                <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Access Key</label>
                <input 
                    type="password" 
                    name="password" 
                    id="password"
                    required
                    disabled={isSubmitting}
                    placeholder="••••••••"
                    class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
                />
            </div>

            {#if form?.message}
                <div class="p-3 bg-red-950/50 border border-red-900 rounded-lg text-xs text-red-400 font-medium animate-fade-in text-center">
                    {form.message}
                </div>
            {/if}

            <button 
                type="submit" 
                disabled={isSubmitting}
                class="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
                <span>{isSubmitting ? "Verifying Credentials..." : "Authorize Access"}</span>
            </button>
        </form>
    </div>
</main>
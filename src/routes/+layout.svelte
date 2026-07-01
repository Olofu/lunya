<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    // Data comes from the +layout.server.ts load function
    let { data, children } = $props();
    const { role } = data;
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{#if role}
    <nav class="flex gap-6 p-4 bg-slate-900 border-b border-slate-800 text-sm">
        <span class="text-slate-500 mr-auto">Role: {role.toUpperCase()}</span>
        
        {#if role === 'admin'}
            <a href="/admin/dashboard" class="text-emerald-400">Dashboard</a>
        {:else if role === 'chw'}
            <a href="/chw/register" class="text-emerald-400">Register Mother</a> 
              <a href="/chw/view-register" class="text-emerald-400">Viewr Mother</a>
        {/if}
        
        <form method="POST" action="/login?/logout">
            <button class="text-rose-400">Logout</button>
        </form>
    </nav>
{/if}

<main>
    {@render children()}
</main>
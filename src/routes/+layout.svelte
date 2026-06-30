<script lang="ts">
    // Receive the data returned from +layout.server.ts
    let { data, children } = $props();
</script>

{#if data.role}
    <nav>
        <p>Logged in as: {data.role}</p>
    </nav>
{/if}

<main>
    {@render children()}
</main>
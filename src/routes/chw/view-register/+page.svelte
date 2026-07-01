<script lang="ts">
    let { data } = $props();
    const { mothers } = data;

    // Reactivity for search filter
    let searchQuery = $state("");

    // Filtered list based on search query
    let filteredMothers = $derived(
        mothers.filter((m: any) => 
            m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.secret_id.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
</script>

<div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Registered Mothers</h1>

    <div class="mb-6">
        <input 
            type="text" 
            placeholder="Search by name or secret ID..." 
            bind:value={searchQuery}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
    </div>

    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="w-full text-left border-collapse">
            <thead class="bg-gray-100 border-b">
                <tr>
                    <th class="p-4 font-semibold text-gray-700">Secret ID</th>
                    <th class="p-4 font-semibold text-gray-700">Name</th>
                    <th class="p-4 font-semibold text-gray-700">Age</th>
                    <th class="p-4 font-semibold text-gray-700">LGA</th>
                    <th class="p-4 font-semibold text-gray-700">Joined</th>
                    <th class="p-4 font-semibold text-gray-700 text-center">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                {#each filteredMothers as mother}
                    <tr class="hover:bg-gray-50 transition">
                        <td class="p-4 font-medium text-blue-600">{mother.secret_id}</td>
                        <td class="p-4">{mother.full_name}</td>
                        <td class="p-4">{mother.age}</td>
                        <td class="p-4">{mother.lga}</td>
                        <td class="p-4">{new Date(mother.joined_at).toLocaleDateString()}</td>
                        <td class="p-4 flex justify-center gap-2">
                            <button class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Edit</button>
                            <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Delete</button>
                        </td>
                    </tr>
                {:else}
                    <tr><td colspan="6" class="p-8 text-center text-gray-500">No records found.</td></tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
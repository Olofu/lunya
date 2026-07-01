<script lang="ts">
    export let data;
    const { mothers } = data;
</script>

<h1>Registered Mothers</h1>

<table>
    <thead>
        <tr>
            <th>Secret ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>LGA</th>
            <th>Joined</th>
        </tr>
    </thead>
    <tbody>
        {#each mothers as mother}
            <tr>
                <td>{mother.secret_id}</td>
                <td>{mother.full_name}</td>
                <td>{mother.age}</td>
                <td>{mother.lga}</td>
                <td>{new Date(mother.joined_at).toLocaleDateString()}</td>
            </tr>
        {:else}
            <tr><td colspan="5">No records found.</td></tr>
        {/each}
    </tbody>
</table>
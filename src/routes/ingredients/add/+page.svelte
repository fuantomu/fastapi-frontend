<script lang="ts">
  import { goto } from "$app/navigation";
  import AliasList from "$lib/components/AliasList.svelte";
  import { v4 as uuidv4 } from "uuid";

  let aliasList: string[] = $state([]);

  function handleGoBack() {
    goto("/ingredients");
  }

  let aliasError: string | null = $state(null);
  function handleErrors(error: string | null) {
    aliasError = error;
  }
</script>

<h1>Test</h1>
<form method="POST">
  <input id="id" type="hidden" name="id" value={uuidv4()} />
  <input id="name" name="name" type="text" placeholder="Name" required />
  <input
    id="description"
    name="description"
    type="text"
    placeholder="Description (Optional)"
  />
  <AliasList {aliasList} onErrorChange={handleErrors} />
  <button type="submit" disabled={aliasError ? true : false}>Save</button>
</form>
<button onclick={() => handleGoBack()}> Go back </button>

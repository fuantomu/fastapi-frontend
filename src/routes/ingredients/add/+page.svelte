<script lang="ts">
  import { goto } from "$app/navigation";
  import AliasList from "$lib/components/AliasList.svelte";
  import { v4 as uuidv4 } from "uuid";

  let aliasList: string[] = $state([]);
  let nameInput: string = $state("");

  function handleGoBack() {
    goto("/ingredients");
  }

  let aliasError: string | null = $state(null);
  function handleErrors(error: string | null) {
    aliasError = error;
  }

  function handleInput(inputValue: string) {
    nameInput = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
  }
</script>

<h1>Test</h1>
<form method="POST">
  <input id="id" type="hidden" name="id" value={uuidv4()} />
  <input
    id="name"
    name="name"
    type="text"
    placeholder="Name"
    bind:value={nameInput}
    oninput={() => handleInput(nameInput)}
    required
  />
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

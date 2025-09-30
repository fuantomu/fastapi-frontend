<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import AliasList from "$lib/components/AliasList.svelte";

  const id = page.url.pathname;
  let { data }: PageProps = $props();
  let aliasList: string[] = $state(data.ingredient?.alias ?? []);
  let edit: Boolean = $state(false);

  function handleGoBack() {
    goto("/ingredients");
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }
  function handleEdit() {
    edit = !edit;
    aliasList = data.ingredient?.alias ?? [];
    aliasError = null;
  }

  let aliasError: string | null = $state(null);
  function handleErrors(error: string | null) {
    aliasError = error;
  }
</script>

<h1>Test</h1>
{#if data.ingredient}
  {#if edit}
    <h2>Edit</h2>
    <form method="POST">
      <input id="id" type="hidden" name="id" value={data.ingredient.id} />
      <input
        id="name"
        name="name"
        type="text"
        value={data.ingredient.name}
        required
      />
      <input
        id="description"
        name="description"
        type="text"
        value={data.ingredient.description}
      />
      {#if aliasList}
        <AliasList {aliasList} onErrorChange={handleErrors} />
      {/if}
      <button type="submit" disabled={aliasError ? true : false}
        >Save</button
      >
      <button type="reset" onclick={() => handleEdit()}>Cancel</button>
    </form>
  {:else}
    <h2>Show</h2>
    {data.ingredient.name}
    {data.ingredient.description}
    {#if aliasList}
      <ul>
        {#each aliasList as alias}
          <li>
            {alias}
          </li>
        {/each}
      </ul>
    {/if}
    <button onclick={() => handleEdit()}>Edit</button>
    <button onclick={() => handleDelete()}>Delete Ingredient</button>
  {/if}
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>Loading</p>
{/if}

<br />
<button onclick={() => handleGoBack()}> Go back </button>

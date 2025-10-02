<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Ingredient } from "$lib/types";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let ingredients: Ingredient[] = $state(data.items?.sort() ?? []);
  let searchValue: string = $state("");

  function handleGoBack() {
    goto("/");
  }
  function handleAdd() {
    goto("/ingredients/add");
  }

  function handleSearch(searchText: string) {
    ingredients =
      data.items?.filter((item) => item.name.includes(searchText)) ?? [];
  }
</script>

<h1>Test</h1>
{#if ingredients}
  <input
    placeholder="Search"
    name="searchItems"
    bind:value={searchValue}
    oninput={() => handleSearch(searchValue)}
  />
  <ul>
    {#each ingredients as ingredient}
      <li>
        <a href="/ingredients/{ingredient.id}" data-sveltekit-preload-data="off"
          >{ingredient.name}</a
        >
      </li>
    {/each}
  </ul>
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>Loading</p>
{/if}
<button onclick={() => handleAdd()}> Add new </button>
<button onclick={() => handleGoBack()}> Go back </button>

<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Recipe } from "$lib/types";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let recipes: Recipe[] = $state(data.items ?? []);
  let searchValue: string = $state("");

  function handleGoBack() {
    goto("/");
  }
  function handleAdd() {
    goto("/recipes/add");
  }

  function handleSearch(searchText: string) {
    recipes =
      data.items?.filter((item) => item.name.includes(searchText)) ?? [];
  }
</script>

<h1>Test</h1>
{#if recipes}
  <input
    placeholder="Search"
    name="searchItems"
    bind:value={searchValue}
    oninput={() => handleSearch(searchValue)}
  />
  <ul>
    {#each recipes as recipe}
      <li>
        <a href="/recipes/{recipe.id}" data-sveltekit-preload-data="off"
          >{recipe.name}</a
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

<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Character } from "$lib/types";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let characters: Character[] = $state(data.items ?? []);
  let searchValue: string = $state("");

  function handleGoBack() {
    goto("/");
  }
  function handleAdd() {
    goto("/characters/add");
  }

  function handleSearch(searchText: string) {
    characters =
      data.items?.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase())) ?? [];
  }
</script>

<h1>Test</h1>
{#if characters}
  <input
    placeholder="Search"
    name="searchItems"
    bind:value={searchValue}
    oninput={() => handleSearch(searchValue)}
  />
  <ul>
    {#each characters as character}
      <li>
        <a href="/characters/{character.id}" data-sveltekit-preload-data="off"
          >{character.name}</a
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

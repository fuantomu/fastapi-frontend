<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  function handleGoBack() {
    goto("/");
  }
  function handleAdd() {
    goto("/ingredients/add");
  }
</script>

<h1>Test</h1>
{#if data.items}
  <ul>
    {#each data.items as ingredient}
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

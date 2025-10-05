<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Guild } from "$lib/types";
  import { getContext } from "svelte";
  import type { PageProps } from "./$types";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { t } from "$lib/i18n/index.svelte";

  let { data }: PageProps = $props();
  let guilds: Guild[] = $state(data.items?.sort() ?? []);
  let searchValue: string = $state("");
  const gameVersion = getContext<GameVersionName>("gameVersion");

  function handleGoBack() {
    goto(`/${gameVersion}`);
  }
  function handleAdd() {
    goto(`/${gameVersion}/guilds/add`);
  }

  function handleSearch(searchText: string) {
    guilds =
      data.items?.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      ) ?? [];
  }
</script>

<h1>Test - {t(`version.${gameVersion}`)}</h1>
{#if guilds}
  <input
    placeholder="Search"
    name="searchItems"
    bind:value={searchValue}
    oninput={() => handleSearch(searchValue)}
  />
  <ul>
    {#each guilds as guild}
      <li>
        <a
          href="/{gameVersion}/guilds/{guild.id}"
          data-sveltekit-preload-data="off">{guild.name}</a
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

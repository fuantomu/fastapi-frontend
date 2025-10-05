<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import { t } from "$lib/i18n/index.svelte";
  import { getContext } from "svelte";
  import type { GameVersionName } from "$lib/versions/GameVersion";

  const id = page.url.pathname;

  let { data }: PageProps = $props();
  const gameVersion = getContext<GameVersionName>("gameVersion");

  function handleGoBack() {
    goto(`${id}`.replace("/delete", ""));
  }
</script>

<h1>Test {t(`version.${gameVersion}`)}</h1>
{#if data.item}
  <form method="POST">
    Are you sure you want to delete the character '{data.item.name}'?
    <input id="id" type="hidden" name="id" value={data.item.id} />
    <input
      id="gameVersion"
      type="hidden"
      name="gameVersion"
      value={gameVersion}
    />
    <button type="submit">Delete</button>
  </form>
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>Loading</p>
{/if}
<br />
<button onclick={() => handleGoBack()}> Go back </button>

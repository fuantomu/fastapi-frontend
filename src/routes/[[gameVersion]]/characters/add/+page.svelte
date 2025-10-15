<script lang="ts">
  import { goto } from "$app/navigation";
  import { getContext } from "svelte";
  import type { PageProps } from "./$types";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import CharacterEditFrame from "$lib/components/character/add/CharacterEditFrame.svelte";
  let { data }: PageProps = $props();
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  function handleGoBack() {
    goto(`/${gameVersionFactory.gameVersion.getName()}/characters`);
  }

</script>

<h1>Test {t(`version.${gameVersionFactory.gameVersion.getName()}`)}</h1>
{#if data.characters && data.guilds}
  <CharacterEditFrame character={undefined} character_guild={undefined} characters={data.characters} guilds={data.guilds}
  ></CharacterEditFrame>
{/if}

<button onclick={() => handleGoBack()}> Go back </button>

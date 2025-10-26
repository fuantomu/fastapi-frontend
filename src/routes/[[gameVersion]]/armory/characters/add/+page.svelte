<script lang="ts">
  import { getContext } from "svelte";
  import type { PageProps } from "./$types";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import ArmoryFrame from "$lib/components/character/ArmoryFrame.svelte";
  let { data }: PageProps = $props();
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

</script>

<h1>{t(`version.${gameVersionFactory.gameVersion.getName()}`)}</h1>
{#if data.characters && data.guilds}
  <ArmoryFrame id={0}></ArmoryFrame>
{/if}

<script lang="ts">
  import type { PageProps } from "./$types";
  import { getContext } from "svelte";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { t } from "$lib/i18n/index.svelte";
  import ArmoryFrame from "$lib/components/character/ArmoryFrame.svelte";

  const gameVersion = getContext<GameVersionName>("gameVersion");
  let { data }: PageProps = $props();
</script>

<h1>Test - {t(`version.${gameVersion}`)}</h1>
{#if data.id}
  <ArmoryFrame id={Number(data?.id)} />
{/if}

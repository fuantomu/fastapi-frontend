<script lang="ts">
  import { t } from "$lib/i18n/index.svelte";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  export let title: string | null = null;

  const gameVersion = getContext<GameVersionName>("gameVersion");
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div style="height: 80px; background-color: var(--game-colour-{gameVersion})">
  <span
    style="height: 100%; display: flex; align-items: center; justify-content:center; text-shadow: 2px 2px black; font-size: 60px;"
  >
    {title ?? t(`version.${gameVersion}`)}
  </span>
</div>

<script lang="ts">
  import { t } from "$lib/i18n/index.svelte";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import AccountFrame from "./Account/AccountFrame.svelte";
  const { title = null } = $props<{
    title: string | null;
  }>();

  const gameVersion = getContext<GameVersionName>("gameVersion");
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div
  class="header-bar"
  style={`background-color: var(--game-colour-${gameVersion})`}
>
  <div style="flex: 1; text-align: center">{title ?? t(`version.${gameVersion}`)}</div>
  <div style="padding-right: 1rem;"><AccountFrame /></div>
</div>

<style>
  .header-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    text-shadow: 2px 2px black;
    font-size: 60px;
    position: relative;
  }
</style>

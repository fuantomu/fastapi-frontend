<script lang="ts">
  import type { CharacterItem } from "$lib/types";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getContext } from "svelte";
  import { t } from "$lib/i18n/index.svelte";
  export let equipment: CharacterItem | null;
  export let slot: string;
  export let reverse: boolean = false;

  const gameVersion = getContext<GameVersionName>("gameVersion");
</script>

<div style="display: flex; align-items: center; margin-top: 5px;">
  {#if equipment}
    {#if reverse}
      <a
        href={`${getWowheadLink("item", gameVersion)}${equipment.id}`}
        data-wowhead={`${equipment.wowhead_link}`}
        style="text-decoration:none"
      >
        <span
          style="color: var(--item-quality-colour-{equipment.quality}); margin-right: 5px;"
          >{equipment.name}</span
        >
        <WarcraftIcon src={equipment.icon}></WarcraftIcon>
      </a>
    {:else}
      <a
        href={`${getWowheadLink("item", gameVersion)}${equipment.id}`}
        data-wowhead={`${equipment.wowhead_link}`}
        style="text-decoration:none"
      >
        <WarcraftIcon src={equipment.icon}></WarcraftIcon>
        <span
          style="color: var(--item-quality-colour-{equipment.quality}); margin-left: 5px;"
          >{equipment.name}</span
        >
      </a>
    {/if}
  {:else if reverse}
    <span style="color: var(--palette-secondary-main); margin-right: 10px;"
      >{t("equipment.empty")}</span
    >
    <img
      src={`/image/paperdoll/empty_${slot}.png`}
      alt={t(`equipment.${slot}`)}
      style="width: var(--spacing-xl); height: var(--spacing-xl)"
    />
  {:else}
    <img
      src={`/image/paperdoll/empty_${slot}.png`}
      alt={t(`equipment.${slot}`)}
      style="width: var(--spacing-xl); height: var(--spacing-xl)"
    /><span style="color: var(--palette-secondary-main); margin-left: 10px;"
      >{t("equipment.empty")}</span
    >
  {/if}
</div>

<style>
  :global(.wowhead-tooltip .whtt-tooltip-icon) {
    display: none !important;
  }
</style>

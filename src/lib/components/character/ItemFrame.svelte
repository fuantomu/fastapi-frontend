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

<div style="height: 32px;">
  {#if equipment}
    <a
      href={`${getWowheadLink("item", gameVersion)}${equipment.id}`}
      data-wowhead={`${equipment.wowhead_link}`}
      class="equipment-link"
    >
      {#if reverse}
        <span
          class="equipment-text"
          style="color: var(--item-quality-colour-{equipment.quality});"
          >{equipment.name}</span
        >
        <WarcraftIcon src={equipment.icon} />
      {:else}
        <WarcraftIcon src={equipment.icon} />
        <span
          class="equipment-text"
          style="color: var(--item-quality-colour-{equipment.quality});"
          >{equipment.name}</span
        >
      {/if}
    </a>
  {:else if reverse}
    <div class="equipment-link">
      <span class="equipment-text">{t("equipment.empty")}</span>
      <img
        src={`/image/paperdoll/empty_${slot}.png`}
        alt={t(`equipment.${slot}`)}
        style="width: 32px; height: 32px"
      />
    </div>
  {:else}
    <div class="equipment-link">
      <img
        src={`/image/paperdoll/empty_${slot}.png`}
        alt={t(`equipment.${slot}`)}
        style="width: 32px; height: 32px"
      /><span class="equipment-text">{t("equipment.empty")}</span>
    </div>
  {/if}
</div>

<style>
  :global(.wowhead-tooltip .whtt-tooltip-icon) {
    display: none !important;
  }
  .equipment-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    gap: 10px;
    max-width: 100%;
  }

  .equipment-text {
    color: var(--palette-secondary-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    display: inline-block;
  }
</style>

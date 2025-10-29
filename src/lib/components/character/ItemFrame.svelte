<script lang="ts">
  import type { CharacterItem } from "$lib/types";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getContext } from "svelte";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  let {
    equipment = $bindable(),
    slot,
    reverse = false,
  } = $props<{
    equipment: CharacterItem | null;
    slot: string;
    reverse: boolean;
  }>();

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
</script>

<div style="height: 42px">
  {#if equipment}
    <a
      href={`${getWowheadLink("item", gameVersionFactory.gameVersion.getName())}${equipment.id}`}
      target="_blank"
      rel="noopener noreferrer"
      data-wowhead={`${equipment.wowhead_link}`}
      class="equipment-link"
    >
      {#if reverse}
        <div style={"display: flex; align-items: start;"}>
          <div style={"display: grid; justify-items: end; margin-right: 10px"}>
            <span
              class="equipment-text"
              style="color: var(--item-quality-colour-{equipment.quality});"
              >{equipment.name}</span
            >
            {#each equipment.enchantment?.split("##") as enchant}
              <span
                style="color: var(--item-quality-colour-Uncommon); font-size: 0.75em; margin-top: -4px; margin-bottom: -4px"
                >{enchant.replace("Enchanted: ", "")}</span
              >
            {/each}
          </div>
          <div style="display: grid; align-content: center; height: 40px">
            <WarcraftIcon src={equipment.icon} />
          </div>
        </div>
      {:else}
        <div style={"display: flex; align-items: start;"}>
          <div style="display: grid; align-content: center; height: 40px">
            <WarcraftIcon src={equipment.icon} />
          </div>
          <div
            style={"display: grid; justify-items: start; margin-left: 10px;"}
          >
            <span
              class="equipment-text"
              style="color: var(--item-quality-colour-{equipment.quality});"
              >{equipment.name}</span
            >
            {#each equipment.enchantment?.split("##") as enchant}
              <span
                style="color: var(--item-quality-colour-Uncommon); font-size: 0.75em; margin-top: -4px; margin-bottom: -4px"
                >{enchant.replace("Enchanted: ", "")}</span
              >
            {/each}
          </div>
        </div>
      {/if}
    </a>
  {:else if reverse}
    <div style={"display: flex; align-items: start;"}>
      <div style={"display: grid; justify-items: end; margin-right: 10px"}>
        <span class="equipment-text">{t("equipment.empty")}</span>
      </div>
      <div style="display: grid; align-content: center; height: 40px">
        <img
          src={`/image/paperdoll/empty_${slot}.png`}
          alt={t(`equipment.${slot}`)}
          style="width: 34px; height: 32px"
        />
      </div>
    </div>
  {:else}
    <div style={"display: flex; align-items: start;"}>
      <div style="display: grid; align-content: center; height: 40px">
        <img
          src={`/image/paperdoll/empty_${slot}.png`}
          alt={t(`equipment.${slot}`)}
          style="width: 32px; height: 34px"
        />
      </div>
      <div style={"display: grid; justify-items: start; margin-left: 10px;"}>
        <span class="equipment-text">{t("equipment.empty")}</span>
      </div>
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
  }

  .equipment-text {
    color: var(--palette-secondary-main);
  }
</style>

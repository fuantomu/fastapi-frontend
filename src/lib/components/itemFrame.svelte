<script lang="ts">
  import type { CharacterItem } from "$lib/types";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import WarcraftIcon from "./WarcraftIcon.svelte";
  import { getContext } from "svelte";
  export let equipment: CharacterItem | null;
  const gameVersion = getContext<GameVersionName>("gameVersion");
</script>

{#if equipment}
  <a
    href={`${getWowheadLink("item", gameVersion)}${equipment.id}`}
    data-wowhead={`${equipment.wowhead_link}`}
  >
    <WarcraftIcon src={equipment.icon}></WarcraftIcon>
    {equipment.name}
  </a>
  <br />
{/if}

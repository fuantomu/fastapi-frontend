<script lang="ts">
  import type { Talent } from "$lib/types";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import WarcraftIcon from "./WarcraftIcon.svelte";
  import { getContext } from "svelte";
  export let talent: Talent | null;
  const gameVersion = getContext<GameVersionName>("gameVersion")
</script>

{#if talent}
  <a href={`${getWowheadLink("spell", gameVersion)}${talent.id}`}
    ><WarcraftIcon src={talent.icon} />{talent.name}</a
  >
  <br />
{/if}

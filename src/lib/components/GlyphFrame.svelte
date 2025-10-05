<script lang="ts">
  import type { Glyph } from "$lib/types";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import WarcraftIcon from "./WarcraftIcon.svelte";
  import { getContext } from "svelte";
  export let glyph: Glyph | null;
  const gameVersion = getContext<GameVersionName>("gameVersion")
</script>

{#if glyph}
  <a href={`${getWowheadLink("spell", gameVersion)}${glyph.id}`}>
    <WarcraftIcon src={glyph.icon} />
    {glyph.name}</a
  >
  <br />
{/if}

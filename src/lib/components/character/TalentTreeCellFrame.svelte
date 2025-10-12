<script lang="ts">
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import type { TalentTreeCell } from "$lib/versions/GameVersionTypes";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getWowheadLink } from "$lib/helper/wowhead";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  const { talent, rank } = $props<{
    talent: TalentTreeCell;
    rank: number;
  }>();
</script>

<a
  href={`${getWowheadLink("spell", gameVersionFactory.gameVersion.getName())}${talent.ranks[Math.min(Math.max(0,rank-1), talent.ranks.length-1)]}`}
  style="text-decoration:none"
>
  <div
    class="icon-container"
    style={rank === 0
      ? "border: 1px solid var(--ui-colour-talent-tree-disabled)"
      : rank === talent.ranks.length
        ? "border: 1px solid var(--ui-colour-talent-tree-full)"
        : "border: 1px solid var(--ui-colour-talent-tree-set)"}
  >
    <WarcraftIcon src={talent.icon} grayscale={rank == 0} />
    <div
      class="overlay-text"
      style={rank === 0
        ? "color: var(--ui-colour-talent-tree-disabled)"
        : rank === talent.ranks.length
          ? "color: var(--ui-colour-talent-tree-full)"
          : "color: var(--ui-colour-talent-tree-set)"}
    >
      {rank}/{talent.ranks.length}
    </div>
  </div>
</a>

<style>
  .icon-container {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 2px;
  }

  .overlay-text {
    position: absolute;
    bottom: -8px;
    right: -8px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: black;
    font-size: 0.66rem;
    height: 14px;
    padding: 0 4px;
    border-radius: 4px;

    pointer-events: none;
  }

  .icon-container :global(img) {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
</style>

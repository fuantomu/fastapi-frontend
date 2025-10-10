<script lang="ts">
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import type { Talent as TalentType } from "$lib/types";
  import type { Talent } from "$lib/versions/GameVersionTypes";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  const { talents, active_talent, row } = $props<{
    talents: Talent[] | null;
    active_talent: TalentType | undefined;
    row: number;
  }>();
</script>

{#if talents}
  <div style="margin-bottom: 5px;">
    <div
      style="border: 1px solid black; display: grid; grid-template-columns: 10% 30% 30% 30%; "
    >
      <span
        style="display: flex; align-items: center; justify-content: center; margin-left: -25px "
        >{row}</span
      >
      {#each talents as talent}
        {#if talent.id}
        <div
          style={active_talent?.id === talent.id
            ? "position: relative; height: 50px; border: 1px solid yellow;"
            : "position: relative; height: 50px;"}
        >
          <a
            href={`${getWowheadLink("spell", gameVersionFactory.gameVersion.getName())}${talent.id}`}
            style="
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        text-decoration: none;
        color: inherit;
      "
          >
          
            <div
              style="
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
        "
            >
              <WarcraftIcon src={talent.icon} />
            </div>
         
            <span
              style="
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-25%, -50%);
          width: 100%;
        "
            >
              {talent.name}
            </span>
          </a>
        </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<script lang="ts">
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import type { Glyph } from "$lib/types";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  const { glyphs } = $props<{
    glyphs: Glyph[];
  }>();
  const emptyArray = Array(3).fill({})
  

  function getGlyphs() {
    if (glyphs.length < emptyArray.length) {
      glyphs.push(...emptyArray.slice(0, emptyArray.length-glyphs.length));
    }
    return glyphs
  }
</script>

{#if glyphs}
  {#each getGlyphs() as glyph}
    <div style="margin-bottom: 5px;">
      <div style="border: 1px solid black; height: 80px;">
        <a
          href={`${getWowheadLink("spell", gameVersionFactory.gameVersion.getName())}${glyph.id}`}
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-decoration: none;
            color: inherit;
            position: relative;
            margin-left: 8px;
            "
        >
          <div
            style="
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
          "
          >
            {#if glyph.icon}
              <WarcraftIcon src={glyph.icon} />
            {/if}
          </div>
          <span>
            {glyph.name}
          </span>
        </a>
      </div>
    </div>
  {/each}
{/if}

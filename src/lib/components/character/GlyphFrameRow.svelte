<script lang="ts">
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import type { Glyph } from "$lib/types";
  import { t } from "$lib/i18n/index.svelte";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  const { glyphs } = $props<{
    glyphs: Glyph[];
  }>();
  const emptyArray = Array(3).fill({});

  function getGlyphs() {
    if (glyphs.length < emptyArray.length) {
      glyphs.push(...emptyArray.slice(0, emptyArray.length - glyphs.length));
    }
    return glyphs;
  }
</script>

{#if glyphs}
  {#each getGlyphs() as glyph}
    <div style="margin-bottom: 5px;">
      <div style="border: 1px solid black; height: 80px;">
        {#if glyph.icon}
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
              <WarcraftIcon src={glyph.icon} />
            </div>
            <span style="width: 50%; color: var(--item-quality-colour-Common)">
              {glyph.name}
            </span>
          </a>
        {:else}
          <div
            style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-decoration: none;
            color: inherit;
            position: relative;
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
              <img
                src="/image/paperdoll/empty.png"
                style="width: 32px; height: 32px;"
                alt={t("equipment.empty")}
              />
            </div>
            <span style="width: 50%; color: var(--palette-secondary-main)">{t("equipment.empty")}</span>
          </div>
        {/if}
      </div>
    </div>
  {/each}
{/if}

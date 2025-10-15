<script lang="ts">
  import type { Glyph } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { t } from "$lib/i18n/index.svelte";
  import GlyphFrameRow from "./GlyphFrameRow.svelte";
  import { Content } from "@smui/paper";
  import { GameVersionName } from "$lib/versions/GameVersion";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  const { glyphs = [] } = $props<{
    glyphs: Glyph[];
  }>();
</script>

{#if glyphs}
  <div
    style="background-color: #111111; border: 1px solid black; padding: 20px; display: flex; flex-direction: column; min-height: 400px;"
  >
    <span style="align-self: center; margin-bottom: 15px">
      {t("ui.glyphs")}
    </span>
    {#if ["mop", "wotlk"].includes(gameVersionFactory.gameVersion.getName())}
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <Content style="width: 50%">
          <div
            style="display: flex; justify-content: center; margin-bottom: 8px"
          >
            {t("ui.majorGlyphs")}
          </div>
          <GlyphFrameRow
            glyphs={glyphs.filter((glyph: Glyph) => glyph.type === "Major")}
          ></GlyphFrameRow>
        </Content>
        <Content style="width: 50%">
          <div
            style="display: flex; justify-content: center; margin-bottom: 8px"
          >
            {t("ui.minorGlyphs")}
          </div>
          <GlyphFrameRow
            glyphs={glyphs.filter((glyph: Glyph) => glyph.type === "Minor")}
          ></GlyphFrameRow>
        </Content>
      </div>
    {:else if gameVersionFactory.gameVersion.getName() === GameVersionName.CATA}
    <div style="display: flex; justify-content: space-between; width: 100%;">
      <Content style="width: 30%">
          <div
            style="display: flex; justify-content: center; margin-bottom: 8px"
          >
            {t("ui.primeGlyphs")}
          </div>
          <GlyphFrameRow
            glyphs={glyphs.filter((glyph: Glyph) => glyph.type === "Prime")}
          ></GlyphFrameRow>
        </Content>
        <Content style="width: 30%">
          <div
            style="display: flex; justify-content: center; margin-bottom: 8px"
          >
            {t("ui.majorGlyphs")}
          </div>
          <GlyphFrameRow
            glyphs={glyphs.filter((glyph: Glyph) => glyph.type === "Major")}
          ></GlyphFrameRow>
        </Content>
        <Content style="width: 30%">
          <div
            style="display: flex; justify-content: center; margin-bottom: 8px"
          >
            {t("ui.minorGlyphs")}
          </div>
          <GlyphFrameRow
            glyphs={glyphs.filter((glyph: Glyph) => glyph.type === "Minor")}
          ></GlyphFrameRow>
        </Content>
      </div>
    {/if}
  </div>
{/if}

<script lang="ts">
  import type { Glyph } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { t } from "$lib/i18n/index.svelte";
  import GlyphFrameRow from "./GlyphFrameRow.svelte";
  import { Content } from "@smui/paper";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  const { glyphs } = $props<{
    glyphs: Glyph[];
  }>();
</script>

{#if ["classic", "tbc"].includes(gameVersionFactory.gameVersion.getName())}
  <div></div>
{:else if glyphs}
  <div
    style="background-color: #111111; border: 1px solid black; padding: 20px; display: flex; flex-direction: column; min-height: 400px;"
  >
    <span style="align-self: center; margin-bottom: 15px">
      {t("ui.glyphs")}
    </span>
    {#if gameVersionFactory.gameVersion.getName() === "mop"}
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
    {/if}
  </div>
{/if}

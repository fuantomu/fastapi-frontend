<script lang="ts">
  import type { Glyph } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { t } from "$lib/i18n/index.svelte";
  import GlyphFrameRow from "./GlyphFrameRow.svelte";
  import { Content } from "@smui/paper";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { PUBLIC_API_URL } from "$env/static/public";
  import type { PlayerClass } from "$lib/consts";
  import GlyphEditFrameRow from "./GlyphEditFrameRow.svelte";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  let {
    glyphs,
    character_class,
    edit = false,
  } = $props<{
    glyphs: Glyph[];
    character_class: PlayerClass;
    edit: boolean;
  }>();

  let versionGlyphs: Glyph[] = $state([]);

  async function fetchGlyphs() {
    const res = await fetch(
      `${PUBLIC_API_URL}/Glyph/?version=${gameVersionFactory.gameVersion.getName()}&class_name=${character_class}&limit=-1`
    );
    let data = await res.json();

    versionGlyphs = [...data["Result"]];
  }

  function updateGlyphs(new_glyph: Glyph, slot: number){
    glyphs[slot] = new_glyph
  }
  
</script>

<div
  style="background-color: #111111; border: 1px solid black; padding: 20px; display: flex; flex-direction: column; min-height: 400px;"
>
  {#await fetchGlyphs()}
    Loading...
  {:then}
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
          {#if edit}
            <GlyphEditFrameRow
              {glyphs}
              versionGlyphs={versionGlyphs?.filter(
                (glyph: Glyph) => glyph.type === "Major"
              )}
              {character_class}
              glyph_type="Major"
              {updateGlyphs}
            ></GlyphEditFrameRow>
          {:else}
            <GlyphFrameRow
              glyphs={glyphs?.filter((glyph: Glyph) => glyph.type === "Major")}
            ></GlyphFrameRow>
          {/if}
        </Content>
        <Content style="width: 50%">
          <div
            style="display: flex; justify-content: center; margin-bottom: 8px"
          >
            {t("ui.minorGlyphs")}
          </div>
          {#if edit}
            <GlyphEditFrameRow
              {glyphs}
              versionGlyphs={versionGlyphs?.filter(
                (glyph: Glyph) => glyph.type === "Minor"
              )}
              {character_class}
              glyph_type="Minor"
              {updateGlyphs}
            ></GlyphEditFrameRow>
          {:else}
            <GlyphFrameRow
              glyphs={glyphs?.filter((glyph: Glyph) => glyph.type === "Minor")}
            ></GlyphFrameRow>
          {/if}
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
          {#if edit}
            <GlyphEditFrameRow
              {glyphs}
              versionGlyphs={versionGlyphs?.filter(
                (glyph: Glyph) => glyph.type === "Prime"
              )}
              {character_class}
              glyph_type="Prime"
              {updateGlyphs}
            ></GlyphEditFrameRow>
          {:else}
            <GlyphFrameRow
              glyphs={glyphs?.filter((glyph: Glyph) => glyph.type === "Prime")}
            ></GlyphFrameRow>
          {/if}
        </Content>
        <Content style="width: 30%">
          <div
            style="display: flex; justify-content: center; margin-bottom: 8px"
          >
            {t("ui.majorGlyphs")}
          </div>
          {#if edit}
            <GlyphEditFrameRow
              {glyphs}
              versionGlyphs={versionGlyphs?.filter(
                (glyph: Glyph) => glyph.type === "Major"
              )}
              {character_class}
              glyph_type="Major"
              {updateGlyphs}
            ></GlyphEditFrameRow>
          {:else}
            <GlyphFrameRow
              glyphs={glyphs?.filter((glyph: Glyph) => glyph.type === "Major")}
            ></GlyphFrameRow>
          {/if}
        </Content>
        <Content style="width: 30%">
          <div
            style="display: flex; justify-content: center; margin-bottom: 8px"
          >
            {t("ui.minorGlyphs")}
          </div>
          {#if edit}
            <GlyphEditFrameRow
              {glyphs}
              versionGlyphs={versionGlyphs?.filter(
                (glyph: Glyph) => glyph.type === "Minor"
              )}
              {character_class}
              glyph_type="Minor"
              {updateGlyphs}
            ></GlyphEditFrameRow>
          {:else}
            <GlyphFrameRow
              glyphs={glyphs?.filter((glyph: Glyph) => glyph.type === "Minor")}
            ></GlyphFrameRow>
          {/if}
        </Content>
      </div>
    {/if}
  {/await}
</div>

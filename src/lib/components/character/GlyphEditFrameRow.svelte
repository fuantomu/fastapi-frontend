<script lang="ts">
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import type { Glyph } from "$lib/types";
  import { t } from "$lib/i18n/index.svelte";
  import Menu from "@smui/menu";
  import List, { Item } from "@smui/list";
  import { PUBLIC_API_URL } from "$env/static/public";
  import type { PlayerClass } from "$lib/consts";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let {
    glyphs = [],
    versionGlyphs,
    character_class,
    glyph_type,
    updateGlyphs,
  } = $props<{
    glyphs: Glyph[];
    versionGlyphs: Glyph[];
    character_class: PlayerClass;
    glyph_type: string;
    updateGlyphs: (glyph: Glyph, slot: number) => void;
  }>();

  let openMenu: boolean = $state(false);
  let selectedGlyph: string = $state("");
  let fetching: boolean = $state(false);
  let clickedGlyph: [Glyph, number] = $state([{} as Glyph, -1]);
  let foundGlyphs: Glyph[] = $state([]);

  function getGlyphs() {
    const filtered_glyphs = glyphs.filter(
      (glyph: Glyph) => glyph.type === glyph_type
    );
    return filtered_glyphs;
  }

  let glyphTypeOffset = (glyph_type: string) => {
    if (glyph_type === "Major") {
      return gameVersionFactory.gameVersion.getName() === "cata" ? 3 : 0;
    }
    if (glyph_type === "Minor") {
      return gameVersionFactory.gameVersion.getName() === "cata" ? 6 : 3;
    }
    return 0;
  };

  async function fetchGlyph(glyph: Glyph, slot: number) {
    const res = await fetch(
      `${PUBLIC_API_URL}/Glyph/?id=${glyph.id}&version=${gameVersionFactory.gameVersion.getName()}&class_name=${character_class}&limit=-1`
    );
    let data = await res.json();
    if (data["Result"].length > 0) {
      versionGlyphs.push(data["Result"][0]);
      updateGlyphs(data["Result"][0], slot);
    }
    openMenu = false;
  }

  async function searchGlyphs(search: string) {
    foundGlyphs = [];
    fetching = true;

    if (search) {
      let key = "name";
      if (Number.isInteger(Number(search))) {
        key = "id";
      }
      const res = await fetch(
        `${PUBLIC_API_URL}/Glyph?${key}=${search}&version=${gameVersionFactory.gameVersion.getName()}&class_name=${character_class}&type=${glyph_type}&limit=-1`
      );
      const data = await res.json();
      if (data["Result"]) {
        foundGlyphs = [...data["Result"]];
      }
    } else {
      const res = await fetch(
        `${PUBLIC_API_URL}/Glyph?version=${gameVersionFactory.gameVersion.getName()}&class_name=${character_class}&type=${glyph_type}&limit=-1`
      );
      const data = await res.json();
      if (data["Result"]) {
        foundGlyphs = [...data["Result"]];
      }
    }

    fetching = false;
  }

  function handleButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    openMenu = !openMenu;
  }
</script>

<div>
  {#each getGlyphs() as glyph, i}
    <div style="margin-bottom: 5px;">
      <div
        style="border: 1px solid black; height: 80px;"
        role="button"
        tabindex="0"
        onclick={(e: MouseEvent) => {
          clickedGlyph = [glyph, i + glyphTypeOffset(glyph_type)];
          handleButtonClick(e);
        }}
        onkeyup={(e: KeyboardEvent) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            e.preventDefault();
            openMenu = false;
          }
          if (e.key == "Enter") {
            clickedGlyph = [glyph, +glyphTypeOffset(glyph_type)];
            handleButtonClick(e);
          }
        }}
      >
        {#if glyph.icon}
          <a
            href={`${getWowheadLink("spell", gameVersionFactory.gameVersion.getName())}${glyph.id}`}
            target="_blank"
            rel="noopener noreferrer"
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
            role="button"
            tabindex="0"
            onclick={(e: MouseEvent) => {
              clickedGlyph = [glyph, i + glyphTypeOffset(glyph_type)];
              handleButtonClick(e);
            }}
            onkeyup={(e: KeyboardEvent) => {
              if (e.key == "Enter") {
                clickedGlyph = [glyph, i + glyphTypeOffset(glyph_type)];
                handleButtonClick(e);
              }
            }}
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
            <span style="width: 50%; color: var(--palette-secondary-main)"
              >{t("equipment.empty")}</span
            >
          </div>
        {/if}
      </div>
    </div>
  {/each}
  <Menu
    onSMUIMenuSurfaceClosed={() => {
      selectedGlyph = "";
    }}
    bind:open={openMenu}
  >
    <List nonInteractive>
      <Item
        onclick={(e: MouseEvent) => {
          e.stopPropagation();
        }}
        disabled={true}
        style="display: flex; flex-direction: column; align-content: center; justify-content: center;"
      >
        <span>
          {t(`ui.glyph`)}
        </span>
      </Item>
      <div
        style="display: flex; flex-direction: row; gap: 20px; align-items: center; padding: 20px"
      >
        <span>{t("ui.searchGlyph")}</span>
        <input
          class="textinput"
          type="text"
          onkeypress={(e: KeyboardEvent) => {
            if (e.key === "Enter") {
              searchGlyphs(selectedGlyph);
            }
          }}
          bind:value={selectedGlyph}
        />
        <button
          type="button"
          class="button-save"
          onclick={() => {
            searchGlyphs(selectedGlyph);
          }}>{t("ui.saveItem")}</button
        >
      </div>
      {#if fetching}
        <div style="display: flex; flex-direction: column; padding: 20px;">
          <p style="color: yellow;">{t("ui.fetchingItem")}</p>
        </div>
      {/if}
      {#if versionGlyphs.filter((glyph: Glyph) => (glyph.name
            .toLowerCase()
            .includes(selectedGlyph.toLowerCase()) || glyph.id.toString() === selectedGlyph) && glyph.id !== glyphs.find((other_glyph: Glyph) => other_glyph.id === glyph.id)?.id).length === 0 && foundGlyphs.length == 0 && !fetching}
        <div style="display: flex; flex-direction: column; padding: 20px;">
          <p style="color: grey;">{t("ui.noResults")}</p>
        </div>
      {:else if foundGlyphs.length > 0}
        {#each foundGlyphs.filter((glyph: Glyph) => (glyph.name
              .toLowerCase()
              .includes(selectedGlyph.toLowerCase()) || glyph.id.toString() === selectedGlyph) && glyph.id !== glyphs.find((other_glyph: Glyph) => other_glyph.id === glyph.id)?.id) as fglyph}
          <Item
            onclick={(e: MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              fetchGlyph(fglyph, clickedGlyph[1]);
            }}
            disabled={true}
            style="height:fit-content; border-top: 1px solid black"
          >
            <a
              href={`${getWowheadLink("spell", gameVersionFactory.gameVersion.getName())}${fglyph.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style="
            display: flex;
            align-items: center;
            justify-content: start;
            height: 100%;
            width: 100%;
            text-decoration: none;
            color: inherit;
            position: relative;
            gap: 20px;
            padding: 8px;
            "
            >
              <div>
                <WarcraftIcon src={fglyph.icon} />
              </div>
              <span
                style="width: 100%; color: var(--item-quality-colour-Common)"
              >
                {fglyph.name}
              </span>
            </a>
          </Item>
        {/each}
      {:else}
        {#each versionGlyphs.filter((glyph: Glyph) => (glyph.name
              .toLowerCase()
              .includes(selectedGlyph.toLowerCase()) || glyph.id.toString() === selectedGlyph) && glyph.id !== glyphs.find((other_glyph: Glyph) => other_glyph.id === glyph.id)?.id) as vglyph}
          <Item
            onclick={(e: MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              updateGlyphs(vglyph, clickedGlyph[1]);
              openMenu = false;
            }}
            disabled={true}
            style="height:fit-content; border-top: 1px solid black"
          >
            <a
              href={`${getWowheadLink("spell", gameVersionFactory.gameVersion.getName())}${vglyph.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style="
            display: flex;
            align-items: center;
            justify-content: start;
            height: 100%;
            width: 100%;
            text-decoration: none;
            color: inherit;
            position: relative;
            gap: 20px;
            padding: 8px;
            "
            >
              <div>
                <WarcraftIcon src={vglyph.icon} />
              </div>
              <span
                style="width: 100%; color: var(--item-quality-colour-Common)"
              >
                {vglyph.name}
              </span>
            </a>
          </Item>
        {/each}
      {/if}
    </List>
  </Menu>
</div>

<style>
  :global(.wowhead-tooltip .whtt-tooltip-icon) {
    display: none !important;
  }
  .textinput {
    background-color: var(--palette-secondary-main);
    border: 1px solid black;
    height: 32px;
    font-size: medium;
    font-weight: bold;
    padding: 0;
    padding-left: 7px;
  }
</style>

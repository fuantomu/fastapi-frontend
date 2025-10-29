<script lang="ts">
  import type { Enchantment } from "$lib/types";
  import { getContext } from "svelte";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import List, { Item } from "@smui/list";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { getWowheadLink } from "$lib/helper/wowhead";
  let { enchantments, handleUpdateLink, type, slot } = $props<{
    enchantments: Enchantment[];
    handleUpdateLink: (enchants: Enchantment[]) => void;
    type: string;
    slot: string;
  }>();

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let selectedSearch: string = $state("");
  let foundEnchantment: Enchantment[] = $state([]);
  let selectedEnchantment: Enchantment = $state(enchantments[0] as Enchantment);
  let fetching: boolean = $state(false);
  let searching: boolean = $state(false);

  async function searchEnchant(enchantidOrString: string) {
    foundEnchantment = [];
    searching = true;
    fetching = true;
    let res = null;
    if (Number.isSafeInteger(Number(enchantidOrString))) {
      res = await fetch(
        `${PUBLIC_API_URL}/Enchantment/?id=${enchantidOrString}&slot=${type}&version=${gameVersionFactory.gameVersion.getName()}`
      );
    } else {
      res = await fetch(
        `${PUBLIC_API_URL}/Enchantment/?search=${enchantidOrString}&slot=${type}&version=${gameVersionFactory.gameVersion.getName()}`
      );
    }

    let data = await res.json();

    data = data["Result"] as Enchantment[];
    if (data.length === 0) {
      foundEnchantment.push({} as Enchantment);
    } else {
      data.forEach((element: Enchantment) => {
        foundEnchantment.push(element);
      });
    }
    fetching = false;
  }

  function handleEnchantClick(enchant: Enchantment) {
    searching = false;
    foundEnchantment = [];
    selectedEnchantment = enchant;
    enchantments[enchantments.length - 1] = enchant;
    handleUpdateLink(enchantments);
  }

  function handleAddEnchantment() {
    enchantments.push({
      id: 0,
      name: "Unknown",
      display_string: "Unknown",
    } as Enchantment);
    selectedEnchantment = enchantments[enchantments.length - 1];
  }

  function handleDeleteEnchantment(enchant: Enchantment) {
    const index = enchantments.findIndex(
      (item: Enchantment) => item?.id === enchant?.id
    );
    enchantments.splice(index, 1);
    handleUpdateLink(enchantments);
  }
</script>

<div>
  <List nonInteractive>
    <Item
      onclick={(e: MouseEvent) => {
        e.stopPropagation();
      }}
      disabled={true}
      style="display: flex; flex-direction: column; align-content: center; justify-content: center; border-top: 1px solid black"
    >
      <span>
        {t(`ui.current${type}`)}
      </span>
    </Item>
    <div style="display: flex; justify-content: center">
      <button
        onclick={() => handleAddEnchantment()}
        class="button-base"
        style="height: 20px"
        type="button"
        title={t("ui.addEnchantment")}>{t("ui.addEnchantment")}</button
      >
    </div>

    {#each enchantments as enchant}
      <Item
        onclick={(e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        disabled={true}
        style="height:fit-content;"
      >
        <div
          style={"display: flex; justify-content: space-between; margin-left: 10px; width: 100%;"}
        >
          {#if enchant?.source_id}
            <a
              href={`${getWowheadLink("item", gameVersionFactory.gameVersion.getName())}${enchant?.source_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style="
                display: flex;
                align-items: space-between;
                justify-content: space-between;
                width: 100%;
                text-decoration: none;
                color: inherit;
                position: relative;
                gap: 20px;
                padding: 8px;
                "
            >
              <span
                class="equipment-text"
                style="color: var(--item-quality-colour-Uncommon);"
                >{enchant?.name === "Unknown"
                  ? enchant?.display_string
                  : enchant?.name}</span
              >
              <button
                onclick={(e: MouseEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeleteEnchantment(enchant);
                }}
                class="button-base"
                style="height: 20px"
                type="button"
                title={t("ui.deleteEnchantment")}
                >{t("ui.deleteEnchantment")}</button
              >
            </a>
          {:else}
            <span
              class="equipment-text"
              style="color: var(--item-quality-colour-Uncommon);"
              >{enchant?.name === "Unknown"
                ? enchant?.display_string
                : enchant?.name}</span
            >
            <button
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                handleDeleteEnchantment(enchant);
              }}
              class="button-base"
              style="height: 20px"
              type="button"
              title={t("ui.deleteEnchantment")}
              >{t("ui.deleteEnchantment")}</button
            >
          {/if}
        </div>
      </Item>
    {/each}

    {#if enchantments.find((enchant: Enchantment) => enchant?.id === 0)}
      <div
        style="display: flex; flex-direction: row; gap: 20px; align-items: center; padding: 20px"
      >
        <span>{t("ui.searchEnchant")}</span>
        <input
          class="textinput"
          type="text"
          spellcheck="false"
          onkeypress={(e: KeyboardEvent) => {
            if (e.key === "Enter" && selectedSearch) {
              searchEnchant(selectedSearch);
            }
          }}
          bind:value={selectedSearch}
        />
        <button
          type="button"
          class="button-base"
          onclick={() => {
            if (selectedSearch) {
              searchEnchant(selectedSearch);
            }
          }}>{t("ui.searchItem")}</button
        >
      </div>
    {/if}
    {#if fetching}
      <div style="display: flex; flex-direction: column; padding: 20px;">
        <p style="color: yellow;">{t("ui.fetchingItem")}</p>
      </div>
    {/if}
    {#if foundEnchantment.length === 0 && !selectedEnchantment?.id && !fetching}
      <div style="display: flex; flex-direction: column; padding: 20px;">
        <p style="color: grey;">{t("ui.noResults")}</p>
      </div>
    {:else if foundEnchantment.length > 0}
      {#each foundEnchantment as fenchant}
        <Item
          onclick={(e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            handleEnchantClick(fenchant);
          }}
          disabled={true}
          style="height:fit-content; border-top: 1px solid black;"
        >
          {#if type !== "Test"}
            <a
              href={`${getWowheadLink("item", gameVersionFactory.gameVersion.getName())}${fenchant.source_id}`}
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
              <span style="width: 100%;">
                {fenchant.name === "Unknown"
                  ? fenchant.display_string
                  : fenchant.name}
              </span>
            </a>
          {:else}
            <span style="width: 100%;">
              {fenchant.name === "Unknown"
                ? fenchant.display_string
                : fenchant.name}
            </span>
          {/if}
        </Item>
      {/each}
    {/if}
  </List>
</div>

<style>
  :global(.wowhead-tooltip .whtt-tooltip-icon) {
    display: none !important;
  }

  .equipment-text {
    color: var(--palette-secondary-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    display: inline-block;
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

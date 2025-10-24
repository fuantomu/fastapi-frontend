<script lang="ts">
  import type { CharacterItem, Enchantment } from "$lib/types";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getContext } from "svelte";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { PUBLIC_API_URL } from "$env/static/public";
  import Menu from "@smui/menu";
  import List, { Item } from "@smui/list";
  import { ICON_QUESTIONMARK } from "$lib/consts";
  import ItemEditEnchantmentFrame from "./ItemEditEnchantmentFrame.svelte";
  import { preventDefault } from "svelte/legacy";
  let {
    equipment = $bindable(),
    slot,
    reverse = false,
  } = $props<{
    equipment: CharacterItem | null;
    slot: string;
    reverse: boolean;
  }>();

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let openMenu: boolean = $state(false);
  let selectedSearch: string = $state("");
  let foundEquipment: CharacterItem[] = $state([]);
  let selectedEquipment: CharacterItem = $state(
    JSON.parse(JSON.stringify(equipment ?? {}))
  );
  let fetching: boolean = $state(false);
  let baseEnchants: Enchantment[] = $state([]);
  let baseGems: Enchantment[] = $state([]);
  let baseUpgrades: number = $state(0);
  let currentEnchants: Enchantment[] = $state([]);
  let currentGems: Enchantment[] = $state([]);
  let currentUpgrades: number = $state(0);
  let enchantmentPromise = getEnchantments();

  async function searchItem(itemidOrString: string) {
    foundEquipment = [];
    fetching = true;
    let res = null;
    if (Number.isSafeInteger(Number(itemidOrString))) {
      res = await fetch(
        `${PUBLIC_API_URL}/Item/?id=${itemidOrString}&slot=${slot}&version=${gameVersionFactory.gameVersion.getName()}`
      );
    } else {
      res = await fetch(
        `${PUBLIC_API_URL}/Item/?search=${itemidOrString}&slot=${slot}&version=${gameVersionFactory.gameVersion.getName()}`
      );
    }
    let data = await res.json();

    fetching = false;
    data = data["Result"] as CharacterItem[];
    if (data.length === 0) {
      foundEquipment.push({
        icon: ICON_QUESTIONMARK,
        name: t("ui.itemNotFound"),
        quality: "Poor",
        id: 0,
      } as CharacterItem);
    } else {
      data.forEach((element: CharacterItem) => {
        element.character_id = Number(window.location.href.split("/").at(-1));
        foundEquipment.push(element);
      });
    }
  }

  async function getEnchantments() {
    if (equipment?.wowhead_link) {
      const enchantments = equipment.wowhead_link.split("&");
      let enchants: string[] = [];
      let gems: string[] = [];
      enchantments.forEach((etype: string) => {
        let current_type = etype.split("=");
        if (current_type[0] === "upgd") {
          currentUpgrades = Number(current_type[1]);
          baseUpgrades = Number(current_type[1]);
        } else if (current_type[0] === "ench") {
          enchants = current_type[1].split(":");
        } else if (current_type[0] === "gems") {
          gems = current_type[1].split(":");
        }
      });
      for (const id of enchants) {
        let res = await fetch(
          `${PUBLIC_API_URL}/Enchantment/?id=${id}&slot=Enchant&version=${gameVersionFactory.gameVersion.getName()}`
        );
        let data = await res.json();
        if (data["Result"]) {
          currentEnchants.push(data["Result"][0]);
          baseEnchants.push(data["Result"][0]);
        }
      }
      for (const id of gems) {
        let res = await fetch(
          `${PUBLIC_API_URL}/Enchantment/?id=${id}&slot=Gem&version=${gameVersionFactory.gameVersion.getName()}`
        );
        let data = await res.json();
        if (data["Result"]) {
          currentGems.push(data["Result"][0]);
          baseGems.push(data["Result"][0]);
        }
      }
    }
  }

  function handleItemClick(item: CharacterItem) {
    console.log("press on item", item);
    item.wowhead_link = "";
    item.enchantment = "";
    selectedEquipment = JSON.parse(JSON.stringify(item));
    console.log(selectedEquipment);
  }

  function handleSaveItem() {
    selectedEquipment.enchantment = currentEnchants
      .map((enchant: Enchantment) =>
        enchant.display_string ? enchant.display_string : enchant.name
      )
      .join("##");
    equipment = JSON.parse(JSON.stringify(selectedEquipment));
    baseEnchants = JSON.parse(JSON.stringify(currentEnchants));
    baseGems = JSON.parse(JSON.stringify(currentGems));
    baseUpgrades = JSON.parse(JSON.stringify(currentUpgrades));
    openMenu = !openMenu;
  }

  function handleButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    selectedEquipment = JSON.parse(JSON.stringify(equipment ?? {}));
    openMenu = !openMenu;
  }

  function handleUpdateEnchantLink(enchants: Enchantment[]) {
    if (enchants) {
      currentEnchants = enchants;
      updateLinks();
    }
  }

  function handleUpdateGemLink(gems: Enchantment[]) {
    if (gems) {
      currentGems = gems;
      updateLinks();
    }
  }

  function handleUpgradeChange(upgrade: number) {
    currentUpgrades = Math.max(Math.min(currentUpgrades + upgrade, 2), 0);
    updateLinks();
  }

  function updateLinks() {
    if (!equipment) {
      return;
    }
    let new_link = "";
    if (currentEnchants.length > 0) {
      new_link += "ench=" + currentEnchants.map((e) => e.id).join(":");
    }
    if (currentGems.length > 0) {
      if (new_link.length > 0) {
        new_link += "&";
      }
      new_link += "gems=" + currentGems.map((e) => e.source_id).join(":");
    }
    if (currentUpgrades > 0) {
      if (new_link.length > 0) {
        new_link += "&";
      }
      new_link += "upgd=" + currentUpgrades;
    }
    equipment.wowhead_link = new_link;
    selectedEquipment = JSON.parse(JSON.stringify(equipment));
  }
</script>

<div>
  {#if equipment?.name}
    <a
      href={`${getWowheadLink("item", gameVersionFactory.gameVersion.getName())}${equipment.id}`}
      data-wowhead={`${equipment.wowhead_link}`}
      class="equipment-link"
    >
      {#if reverse}
        <div
          style={"display: flex; align-items: start;"}
          role="button"
          tabindex="0"
          onclick={(e: MouseEvent) => {
            handleButtonClick(e);
          }}
          onkeyup={(e: KeyboardEvent) => {
            if (e.key == "Enter") {
              handleButtonClick(e);
            }
          }}
        >
          <div style={"display: grid; justify-items: end; margin-right: 10px"}>
            <span
              class="equipment-text"
              style="color: var(--item-quality-colour-{equipment.quality});"
              >{equipment.name}</span
            >
            {#each equipment.enchantment?.split("##") as enchant}
              <span
                style="color: var(--item-quality-colour-Uncommon); font-size: 0.75em; margin-top: -4px; margin-bottom: -4px"
                >{enchant.replace("Enchanted: ", "")}</span
              >
            {/each}
          </div>
          <div style="display: grid; align-content: center; height: 40px">
            <WarcraftIcon src={equipment.icon} />
          </div>
        </div>
      {:else}
        <div
          style={"display: flex; align-items: start;"}
          role="button"
          tabindex="0"
          onclick={(e: MouseEvent) => {
            handleButtonClick(e);
          }}
          onkeyup={(e: KeyboardEvent) => {
            if (e.key == "Enter") {
              handleButtonClick(e);
            }
          }}
        >
          <div style="display: grid; align-content: center; height: 40px">
            <WarcraftIcon src={equipment.icon} />
          </div>
          <div
            style={"display: grid; justify-items: start; margin-left: 10px;"}
          >
            <span
              class="equipment-text"
              style="color: var(--item-quality-colour-{equipment.quality});"
              >{equipment.name}</span
            >
            {#each equipment.enchantment?.split("##") as enchant}
              <span
                style="color: var(--item-quality-colour-Uncommon); font-size: 0.75em; margin-top: -4px; margin-bottom: -4px"
                >{enchant.replace("Enchanted: ", "")}</span
              >
            {/each}
          </div>
        </div>
      {/if}
    </a>
  {:else if reverse}
    <div
      role="button"
      tabindex="0"
      onclick={(e: MouseEvent) => {
        handleButtonClick(e);
      }}
      onkeyup={(e: KeyboardEvent) => {
        if (e.key == "Enter") {
          handleButtonClick(e);
        }
      }}
    >
      <div class="equipment-link">
        <span class="equipment-text">{t("equipment.empty")}</span>
        <img
          src={`/image/paperdoll/empty_${slot}.png`}
          alt={t(`equipment.${slot}`)}
          style="width: 32px; height: 32px"
        />
      </div>
    </div>
  {:else}
    <div
      role="button"
      tabindex="0"
      onclick={(e: MouseEvent) => {
        handleButtonClick(e);
      }}
      onkeyup={(e: KeyboardEvent) => {
        if (e.key == "Enter") {
          handleButtonClick(e);
        }
      }}
    >
      <div class="equipment-link">
        <img
          src={`/image/paperdoll/empty_${slot}.png`}
          alt={t(`equipment.${slot}`)}
          style="width: 32px; height: 32px"
        /><span class="equipment-text">{t("equipment.empty")}</span>
      </div>
    </div>
  {/if}
  <Menu
    onSMUIMenuSurfaceClosed={() => {
      selectedEquipment = JSON.parse(
        JSON.stringify(equipment ?? {})
      ) as CharacterItem;
      selectedSearch = "";
      currentEnchants = JSON.parse(JSON.stringify(baseEnchants));
      currentGems = JSON.parse(JSON.stringify(baseGems));
      currentUpgrades = baseUpgrades;
      updateLinks();
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
          {t(`ui.item`)}
        </span>
      </Item>
      {#if selectedEquipment}
        <Item
          onclick={(e: MouseEvent) => {
            e.stopPropagation();
          }}
          disabled={true}
          style="display: flex; flex-direction: column; align-content: center; justify-content: center; border-top: 1px solid black"
        >
          <span>
            {t(`ui.currentItem`)}
          </span>
        </Item>
        <Item
          onclick={(e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          disabled={true}
          style="height:fit-content"
        >
          <a
            href={`${getWowheadLink("item", gameVersionFactory.gameVersion.getName())}${selectedEquipment?.id}`}
            data-wowhead={`${selectedEquipment?.wowhead_link}`}
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
            cursor: default;
            "
          >
            <div style="display: grid; align-content: center; height: 40px">
              <WarcraftIcon src={selectedEquipment?.icon} />
            </div>
            <div
              style={"display: grid; justify-items: start; margin-left: 10px;"}
            >
              <span
                class="equipment-text"
                style="color: var(--item-quality-colour-{selectedEquipment?.quality});"
                >{selectedEquipment?.name}</span
              >
              {#each currentEnchants as enchant}
                <span
                  style="color: var(--item-quality-colour-Uncommon); font-size: 0.75em; margin-top: -4px; margin-bottom: -4px"
                  >{enchant?.display_string
                    ? enchant?.display_string?.replace("Enchanted: ", "")
                    : enchant?.name}</span
                >
              {/each}
            </div>
          </a>
          {#if gameVersionFactory.gameVersion.getName() == "mop" && slot !== "tabard" && slot !== "shirt"}
            <div
              style="display: flex; flex-direction: column; justify-items: center; align-items: center; width: 200px"
            >
              <span>{t("ui.upgradeLevel")}: {currentUpgrades}/2</span>
              <span
                onclick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleUpgradeChange(1);
                }}
                onkeypress={() => {}}
                role="button"
                tabindex="0"
                style="cursor: pointer; height: 32px; width: 32px; display: flex; justify-items: center; align-items: center;"
                ><img
                  style="width: 32px; height: 32px"
                  src="/image/icon_arrow_up.png"
                  alt={t("ui.addUpgradeLevel")}
                /></span
              >
              <span
                onclick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleUpgradeChange(-1);
                }}
                onkeypress={() => {}}
                role="button"
                tabindex="0"
                style="cursor: pointer;  height: 32px; width: 32px; display: flex; justify-items: center; align-items: center;"
                ><img
                  style="width: 32px; height: 32px"
                  src="/image/icon_arrow_down.png"
                  alt={t("ui.removeUpgradeLevel")}
                /></span
              >
            </div>
          {/if}
        </Item>

        {#await enchantmentPromise then}
          <ItemEditEnchantmentFrame
            enchantments={currentEnchants}
            handleUpdateLink={handleUpdateEnchantLink}
            type="Enchant"
            {slot}
          ></ItemEditEnchantmentFrame>
          <ItemEditEnchantmentFrame
            enchantments={currentGems}
            handleUpdateLink={handleUpdateGemLink}
            type="Gem"
            {slot}
          ></ItemEditEnchantmentFrame>
        {/await}
      {/if}
      <div
        style="display: flex; flex-direction: row; gap: 20px; align-items: center; padding: 20px"
      >
        <span>{t("ui.searchItem")}</span>
        <input
          class="textinput"
          type="text"
          spellcheck="false"
          onkeypress={(e: KeyboardEvent) => {
            if (e.key === "Enter" && selectedSearch) {
              searchItem(selectedSearch);
            }
          }}
          bind:value={selectedSearch}
        />
        <button
          type="button"
          style="height: 34px; border: 1px solid black; background: var(--palette-secondary-dark); cursor: pointer"
          onclick={() => {
            if (selectedSearch) {
              searchItem(selectedSearch);
            }
          }}>{t("ui.searchItem")}</button
        >
      </div>

      {#if fetching}
        <div style="display: flex; flex-direction: column; padding: 20px;">
          <p style="color: yellow;">{t("ui.fetchingItem")}</p>
        </div>
      {/if}
      {#if foundEquipment.length === 0 && !selectedEquipment?.id && !fetching}
        <div style="display: flex; flex-direction: column; padding: 20px;">
          <p style="color: grey;">{t("ui.noResults")}</p>
        </div>
      {:else if foundEquipment.length > 0}
        {#each foundEquipment as fitem (fitem.id)}
          <Item
            onclick={(e: MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              handleItemClick(fitem);
            }}
            disabled={true}
            style="height:fit-content; border-top: 1px solid black"
          >
            <a
              href={`${getWowheadLink("item", gameVersionFactory.gameVersion.getName())}${fitem.id}`}
              data-wowhead={`${fitem?.wowhead_link}`}
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
                <WarcraftIcon src={fitem.icon} />
              </div>
              <span
                style="width: 100%; color: var(--item-quality-colour-{fitem.quality})"
              >
                {fitem.name}
              </span>
            </a>
          </Item>
        {/each}
      {/if}

      <div
        style="display: flex; align-content: center; justify-content: center"
      >
        <button
          onclick={() => handleSaveItem()}
          style="height: 34px; border: 1px solid black; background: var(--palette-secondary-light); cursor: pointer"
          type="button"
          title={t("ui.saveItem")}>{t("ui.saveItem")}</button
        >
      </div>
    </List>
  </Menu>
</div>

<style>
  :global(.wowhead-tooltip .whtt-tooltip-icon) {
    display: none !important;
  }
  .equipment-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    gap: 10px;
    max-width: 100%;
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

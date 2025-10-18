<script lang="ts">
  import type { CharacterItem } from "$lib/types";
  import { getWowheadLink } from "$lib/helper/wowhead";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getContext } from "svelte";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { PUBLIC_API_URL } from "$env/static/public";
  import Menu from "@smui/menu";
  import List, { Item } from "@smui/list";
  import { ICON_QUESTIONMARK } from "$lib/consts";
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
  let selectedId: number = $state(equipment?.id ?? 0);
  let previousId: number = $state(-1);
  let selectedEquipment: CharacterItem = $state(
    JSON.parse(JSON.stringify(equipment ?? {}))
  );
  let fetching: boolean = $state(false);

  async function fetchItem(itemid: number) {
    fetching = true;
    const res = await fetch(
      `${PUBLIC_API_URL}/Item/?id=${itemid}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    let data = await res.json();

    fetching = false;
    data = JSON.parse(data["Result"]) as CharacterItem;
    if (!data.name) {
      selectedEquipment.icon = ICON_QUESTIONMARK;
      selectedEquipment.name = "Could not find item";
      selectedEquipment.quality = "Poor";
      selectedEquipment.id = 0;
    } else {
      selectedEquipment.icon = data.icon;
      selectedEquipment.id = data.id;
      selectedEquipment.enchantment = "";
      selectedEquipment.inventory_type = data.inventory_type;
      selectedEquipment.name = data.name;
      selectedEquipment.quality = data.quality;
      selectedEquipment.wowhead_link = "";
      selectedEquipment.slot = `${slot.charAt(0).toUpperCase()}${slot.slice(1)}`;
      selectedEquipment.character_id = Number(
        window.location.href.split("/").at(-1)
      );
    }
  }

  function handleButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    openMenu = !openMenu;
  }

  function checkUpdateDisabled() {
    return selectedEquipment?.id == undefined || selectedEquipment?.id == 0;
  }
</script>

<div style="height: 32px;">
  {#if equipment?.name}
    <a
      href={`${getWowheadLink("item", gameVersionFactory.gameVersion.getName())}${equipment.id}`}
      data-wowhead={`${equipment.wowhead_link}`}
      class="equipment-link"
    >
      {#if reverse}
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
          <span
            class="equipment-text"
            style="color: var(--item-quality-colour-{equipment.quality});"
            >{equipment.name}</span
          >
          <WarcraftIcon src={equipment.icon} />
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
          <WarcraftIcon src={equipment.icon} />
          <span
            class="equipment-text"
            style="color: var(--item-quality-colour-{equipment.quality});"
            >{equipment.name}</span
          >
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
      selectedEquipment = JSON.parse(JSON.stringify(equipment ?? {}));
    }}
    bind:open={openMenu}
  >
    <List nonInteractive>
      <Item
        onclick={(e: MouseEvent) => {
          e.stopPropagation();
        }}
        disabled={true}
        style="height:fit-content"
      >
        <div style="display: flex; flex-direction: column; gap: 10px">
          <span>{t(`ui.itemSlot.${slot}`)}</span>

          <div
            style="display: flex; flex-direction: row; gap: 20px; align-items: center"
          >
            <span>{t("ui.ItemId")}</span>
            <input
              class="textinput"
              type="number"
              onkeypress={(e: KeyboardEvent) => {
                if (
                  e.key === "Enter" &&
                  selectedId &&
                  selectedId !== previousId
                ) {
                  previousId = selectedId;
                  fetchItem(selectedId);
                }
              }}
              bind:value={selectedId}
            />
            <button
              type="button"
              style="height: 34px; border: 1px solid black; background: var(--palette-secondary-dark); cursor: pointer"
              onclick={() => {
                if (selectedId && selectedId !== previousId) {
                  previousId = selectedId;
                  fetchItem(selectedId);
                }
              }}>{t("ui.loadItem")}</button
            >
          </div>
        </div>
      </Item>
      {#if fetching}
        <div style="display: flex; flex-direction: column; padding: 20px;">
          <p style="color: yellow;">{t("ui.fetchingItem")}</p>
        </div>
      {:else if selectedEquipment?.name}
        <div style="display: flex; flex-direction: column; padding: 20px;">
          <span style="font-size: smaller; font-weight: 100"
            >{t("ui.itemPreview")} (ID: {selectedEquipment?.id ??
              t("ui.itemNoId")})</span
          >
          <a
            href={`${getWowheadLink("item", gameVersionFactory.gameVersion.getName())}${selectedEquipment.id}`}
            data-wowhead={`${selectedEquipment.wowhead_link}`}
            class="equipment-link"
            onclick={(e) => e.preventDefault()}
            ><WarcraftIcon src={selectedEquipment.icon} />
            <span
              class="equipment-text"
              style="color: var(--item-quality-colour-{selectedEquipment.quality});"
              >{selectedEquipment.name}</span
            ></a
          >
        </div>
      {:else}
        <div style="display: flex; flex-direction: column; padding: 20px;">
          <span style="font-size: smaller; font-weight: 100"
            >{t("ui.itemPreview")} (ID: {selectedEquipment?.id ??
              t("ui.itemNoId")})</span
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
      <Item
        onclick={(e: MouseEvent) => {
          if (checkUpdateDisabled()) {
            e.stopPropagation();
          } else {
            equipment = selectedEquipment;
            openMenu = false;
          }
        }}
        style={checkUpdateDisabled()
          ? "background-color: #111111; border: 1px solid black"
          : "background-color: var(--palette-secondary-dark);border: 1px solid black; cursor: pointer"}
        disabled={checkUpdateDisabled()}
      >
        {t("ui.updateItem")}
      </Item>
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

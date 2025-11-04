<script lang="ts">
  import { enhance } from "$app/forms";
  import { Gender, ICON_QUESTIONMARK, Region } from "$lib/consts";
  import { t } from "$lib/i18n/index.svelte";
  import type { Account, Character, Guild } from "$lib/types";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { getContext } from "svelte";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import type { PlayerRace } from "$lib/versions/PlayerRace";
  import { PlayerFaction } from "$lib/versions/PlayerFaction";
  import { PlayerClass } from "$lib/versions/PlayerClass";
  import { PlayerSpec } from "$lib/versions/PlayerSpecialization";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";

  const {
    guilds,
    search = "",
    region = "eu",
    realm = "",
    onAdd,
  } = $props<{
    guilds: Guild[];
    search: string;
    region: string;
    realm: string;
    onAdd: (character: Character) => void;
  }>();

  let modal: HTMLDialogElement;
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let accountState = getContext<Account>("accountState");
  let isOpen: boolean = $state(false);
  let filters: Record<string, any> = $state({
    search: search,
    realm: realm,
    region: region,
    version: gameVersionFactory.gameVersion.getName(),
  });
  let foundCharacter: Character = $state({} as Character);
  let guildName: string = $state("")
  let searching: boolean = $state(false);
  let adding: boolean = $state(false);

  function openModal() {
    isOpen = true;
    filters.search = search;
    filters.realm = realm;
    filters.region = region;
    modal.showModal();
  }

  function closeModal() {
    isOpen = false;
    filters.search = "";
    filters.realm = "";
    filters.region = "None";
    modal.close();
  }
  $effect(() => {
    document.body.style.cursor = (adding || searching) ? "wait" : "";
  })

  function getRaceIcon(race: string, gender: string) {
    const found_race = gameVersionFactory.gameVersion
      .getRaces()
      .find((_race: PlayerRace) => _race.name === race);
    if (found_race) {
      return gameVersionFactory.iconProvider.getFromSource(
        gender === Gender.Female ? found_race.icon_female : found_race.icon_male
      );
    }
    return ICON_QUESTIONMARK;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  async function addCharacter(character: Record<string,any>, guild_name: string) {
    character.guild_name = guild_name
    adding = true
    const res = await fetch(`${PUBLIC_API_URL}/Character/`, {
      method: "POST",
      body: JSON.stringify(character),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    goto(`/${gameVersionFactory.gameVersion.getName()}/armory/characters/${data['Result']}`)
  }
</script>

<div class="search-item">
  <div
    role="button"
    tabindex="0"
    onclick={() => openModal()}
    onkeydown={() => {}}
    style="
    background-color: var(--palette-secondary-main);
    display: flex; 
    align-items:center;
    justify-content:center;
    width: 20vw;
    border: 1px solid black;"
  >
    {t("ui.armory.searchCharacter")}
  </div>
</div>
<dialog
  id="modal"
  aria-labelledby="modal-title"
  style="background-color: var(--palette-secondary-dark); width: 65vw;"
  bind:this={modal}
  closedby="any"
  onclose={closeModal}
  onkeydown={handleKeydown}
>
  {#if adding}
  <div class="fullscreen-blur">
    <p>{t('ui.armory.characterFetch')}</p>
  </div>
  {/if}
  <form
    method="POST"
    action={"?/search"}
    use:enhance={() => {
      searching = true;
      foundCharacter = {} as Character;
      return async ({ update, result }) => {
        await update({ reset: false });
        searching = false;
        if (result.type === "success" && result.data) {
          const item = result.data.character as Record<string, any>
          foundCharacter = item as Character;
          guildName = item.guild_name;
        }
      };
    }}
  >
    <article>
      <header>
        <h4>{t("ui.armory.searchCharacter")}</h4>
      </header>
      <div
        style={`display: grid; grid-template-columns: repeat(3, 20vw); background-color: var(--palette-secondary-dark)`}
      >
        <span
          style="align-items: start; justify-items: center; user-select: none;"
          >{t("ui.armory.characterName")}</span
        >
        <span
          style="align-items: start; justify-items: center; margin-left: 30px; user-select: none;"
          >{t("ui.armory.characterRegion")}</span
        >
        <span
          style="align-items: start; justify-items: center; margin-left: 50px; user-select: none;"
          >{t("ui.armory.characterRealm")}</span
        >
      </div>
      <div
        style={`display: grid; grid-template-columns: repeat(3, 20vw); background-color: var(--palette-secondary-dark)`}
      >
        <input
          hidden
          id="version"
          name="version"
          bind:value={filters.version}
        />
        <input
          style="width: 20vw;"
          placeholder={t("ui.placeholder.search")}
          class="textinput"
          bind:value={filters.search}
          id="search"
          name="search"
          spellcheck="false"
          autocomplete="off"
          required
        />
        <select
          style="width: 20vw; margin-left: 30px;"
          class="select"
          id="characterRegionSelect"
          name="characterRegionSelect"
          required
          bind:value={filters.region}
        >
          {#each Object.keys(Region) as _region}
            <option value={_region.toLowerCase()}
              >{t(`region.${_region}`)}</option
            >
          {/each}
        </select>
        <input
          style="width: 20vw; margin-left: 50px;"
          placeholder={t("ui.placeholder.search")}
          class="textinput"
          bind:value={filters.realm}
          id="realmInput"
          name="realmInput"
          spellcheck="false"
          autocomplete="off"
          required
        />
      </div>
      <div
        style="display: grid; margin-top: 20px; border-bottom: 1px solid black; user-select: none;"
      >
        {t("ui.list.searchResult")}
      </div>
      {#if searching}
        <div
          style="display: flex; width: 100%; align-items: center; justify-content: center; background-color: var(--palette-background-default); height: 32px; color: yellow; user-select: none;"
        >
          {t("ui.list.searching")}
        </div>
      {:else if foundCharacter.name}
        <div
          role="button"
          tabindex="0"
          class="div-item"
          onkeydown={() => {}}
          onclick={() => {
            addCharacter(foundCharacter, guildName);
          }}
        >
          <span
            style="display: flex; align-items: center; color: var(--player-class-colour-{foundCharacter.character_class});"
            >{foundCharacter.name}
            {#if accountState.characters?.includes(foundCharacter.id)}
              <img
                src="/image/ui/icon_home.png"
                style="width: 16px; height: 16px;"
                alt={t("ui.armory.owner")}
              />
            {/if}
          </span>
          <div
            style="display: grid; grid-template-columns: 100%; width: 100%; justify-items: center; color: white;"
          >
            <span>{foundCharacter.realm} </span>
          </div>
          <div
            style="display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; justify-items: center;"
          >
            <WarcraftIcon
              src={getRaceIcon(foundCharacter.race, foundCharacter.gender)}
            ></WarcraftIcon>
            <WarcraftIcon
              src={gameVersionFactory.gameVersion
                .getFactions()
                .find(
                  (_faction: PlayerFaction) =>
                    _faction.name === foundCharacter.faction
                )?.icon ?? ICON_QUESTIONMARK}
            ></WarcraftIcon>
            <WarcraftIcon
              src={gameVersionFactory.gameVersion
                .getClasses()
                .find(
                  (_class: PlayerClass) =>
                    _class.name === foundCharacter.character_class
                )?.icon ?? ICON_QUESTIONMARK}
            ></WarcraftIcon>
            <WarcraftIcon
              src={gameVersionFactory.gameVersion
                .getSpecs()
                .find(
                  (spec: PlayerSpec) =>
                    spec.name ===
                    `${foundCharacter.character_class}${foundCharacter.active_spec}`
                )?.icon ?? ICON_QUESTIONMARK}
            ></WarcraftIcon>
          </div>
          <span style="color: white;">{foundCharacter.level}</span>
          {#if foundCharacter.guild !== null}
            <span style="color: white;"
              >{guilds.find((guild: Guild) => guild.id === foundCharacter.guild)
                ?.name}</span
            >
          {:else}
            <span style="color: var(--item-quality-colour-Poor);"
              >{t("ui.armory.noGuild")}</span
            >
          {/if}
        </div>
      {:else}
        <div
          style="display: flex; width: 100%; align-items: center; justify-content: center; background-color: var(--palette-background-default); height: 32px; user-select: none;"
        >
          {t("ui.list.noResults")}
        </div>
      {/if}
      <div class="search-item">
        <button
          type="submit"
          style="
        background-color: var(--palette-secondary-main);
        display: flex; 
        align-items:center;
        justify-content:center;
        width: 20vw;
        border: 1px solid black;
        user-select: none;"
        >
          {t("ui.armory.searchCharacter")}
        </button>
      </div>
    </article>
  </form>
</dialog>

<style>
  dialog {
    opacity: 100;

    &::backdrop {
      background: rgba(0, 0, 0, 0.66); /* dim the background */
    }
    h4 {
      user-select: none;
    }
  }
  .search-item {
    display: flex;
    margin-top: 30px;
    justify-content: center;
    align-content: center;
    height: 48px;
    width: 100%;
  }
  .div-item {
    display: grid;
    grid-template-columns: 25% 10% 20% 5% 25% 15%;
    background-color: var(--palette-background-default);
    justify-items: center;
    align-items: center;
    height: 32px;
  }
  .div-item:hover {
    background-color: var(--palette-secondary-main);
  }
  .fullscreen-blur {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 2rem;
    z-index: 9999;
  }
</style>

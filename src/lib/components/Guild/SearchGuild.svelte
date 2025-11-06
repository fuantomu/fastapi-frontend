<script lang="ts">
  import { enhance } from "$app/forms";
  import { ICON_QUESTIONMARK, Region } from "$lib/consts";
  import { t } from "$lib/i18n/index.svelte";
  import type { Account, Guild } from "$lib/types";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { getContext } from "svelte";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { PlayerFaction } from "$lib/versions/PlayerFaction";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";

  const {
    search = "",
    region = "eu",
    realm = "",
  } = $props<{
    search: string;
    region: string;
    realm: string;
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
  let foundGuild: Guild = $state({} as Guild);
  let searching: boolean = $state(false);
  let adding: boolean = $state(false);

  function openModal() {
    isOpen = true;
    resetFields();
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
    document.body.style.cursor = adding || searching ? "wait" : "";
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  function resetFields() {
    filters.search = search;
    filters.realm = realm;
    filters.region = region;
  }

  async function addGuild(guild: Record<string, any>) {
    adding = true;
    const res = await fetch(`${PUBLIC_API_URL}/Guild/`, {
      method: "POST",
      body: JSON.stringify(guild),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    goto(
      `/${gameVersionFactory.gameVersion.getName()}/guilds/${data["Result"]}`
    );
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
    {t("ui.guilds.searchGuild")}
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
      <p>{t("ui.guilds.guildFetch")}</p>
    </div>
  {/if}
  <form
    method="POST"
    action={"?/search"}
    use:enhance={() => {
      searching = true;
      foundGuild = {} as Guild;
      return async ({ update, result }) => {
        await update({ reset: false });
        searching = false;
        if (result.type === "success" && result.data) {
          const item = result.data.guild as Record<string, any>;
          foundGuild = item as Guild;
        }
      };
    }}
  >
    <article>
      <header>
        <h4>
          {t("ui.guilds.searchGuild")}
        </h4>
      </header>
      <div
        style={`display: grid; grid-template-columns: repeat(3, 20vw); background-color: var(--palette-secondary-dark)`}
      >
        <span
          style="align-items: start; justify-items: center; user-select: none;"
          >{t("ui.guilds.guildName")}</span
        >
        <span
          style="align-items: start; justify-items: center; margin-left: 30px; user-select: none;"
          >{t("ui.guilds.guildRegion")}</span
        >
        <span
          style="align-items: start; justify-items: center; margin-left: 50px; user-select: none;"
          >{t("ui.guilds.guildRealm")}</span
        >
      </div>
      <div
        style={`display: grid; grid-template-columns: repeat(3, 20vw) 5vw; background-color: var(--palette-secondary-dark)`}
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
          id="guildRegionSelect"
          name="guildRegionSelect"
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
        <button
          type="button"
          style="margin-left: 60px; background: transparent; border: none;
              padding: none; height: 32px; width: 32px;"
          title={t("ui.guild.resetSearch")}
          onclick={() => resetFields()}
          ><img
            style="position: relative; height: 32px; width: 32px; display: inline-block;
              bottom: 1px;
              left: -6px; "
            src="/image/ui/icon_refresh.png"
            alt={t("ui.guild.resetSearch")}
          /></button
        >
      </div>
      <div
        style="margin-top: 20px; border-bottom: 1px solid black; user-select: none;"
      >
        {t("ui.list.searchResult")}
      </div>
      {#if searching}
        <div
          style="display: flex; width: 100%; align-items: center; justify-content: center; background-color: var(--palette-background-default); height: 32px; color: yellow; user-select: none;"
        >
          {t("ui.list.searching")}
        </div>
      {:else if foundGuild.name}
        <div
          role="button"
          tabindex="0"
          class="div-item"
          onkeydown={() => {}}
          onclick={() => {
            addGuild(foundGuild);
          }}
        >
          <span
            style="display: flex; align-items: center; color: var(--faction-colour-{foundGuild.faction});"
            >{foundGuild.name}
            {#if accountState.guild === foundGuild.id}
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
            <span>{foundGuild.realm} </span>
          </div>

          <WarcraftIcon
            src={gameVersionFactory.gameVersion
              .getFactions()
              .find(
                (_faction: PlayerFaction) =>
                  _faction.name === foundGuild.faction
              )?.icon ?? ICON_QUESTIONMARK}
          ></WarcraftIcon>
          <span style="color: white;">{foundGuild.member_count}</span>
          <span style="color: white;">{foundGuild.achievement_points}</span>
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
          {t("ui.guilds.searchGuild")}
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

<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Account, Guild } from "$lib/types";
  import { getContext } from "svelte";
  import type { PageProps } from "./$types";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { t } from "$lib/i18n/index.svelte";
  import Title from "$lib/components/Title.svelte";
  import { page } from "$app/state";
  import { sortBy } from "$lib/helper/sort";
  import { parseModifier } from "$lib/helper/parseFilter";
  import { VirtualList } from "svelte-virtuallists";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import WarcraftIcon from "$lib/components/WarcraftIcon.svelte";
  import { ICON_QUESTIONMARK, Region } from "$lib/consts";
  import { PlayerFaction } from "$lib/versions/PlayerFaction";
  import SearchGuild from "$lib/components/Guild/SearchGuild.svelte";

  let { data }: PageProps = $props();
  let guilds: Guild[] = $state(data.items ?? []);
  let currentSort: string = $state("");
  let reverse: boolean = $state(false);
  const gameVersion = getContext<GameVersionName>("gameVersion");
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let accountState = getContext<Account>("accountState");
  let filterOpen: boolean = $state(
    page.url.searchParams.size > 0 ? true : false
  );
  let filtered_guilds = $derived(getFilteredItems());
  let filtered_length = $derived(filtered_guilds.length);

  let filters: Record<string, any> = $state({
    search: page.url.searchParams.get("name") ?? "",
    realm: getSearchParams("realm"),
    region: page.url.searchParams.get("region") ?? "None",
    faction: page.url.searchParams.get("faction") ?? "None",
  });

  function getSearchParams(
    key: string,
    defaultModifier: string = "i",
    defaultInput: string = ""
  ) {
    const param = page.url.searchParams.get(key);
    if (param) {
      let [mod, search] = decodeURIComponent(param).split("#");
      return { modifier: mod, input: search };
    }
    return { modifier: defaultModifier, input: defaultInput };
  }

  function updateSort(type: string) {
    currentSort === type ? (reverse = !reverse) : (reverse = false);
    currentSort = type;
    if (reverse) {
      return guilds.sort((a: Guild, b: Guild) => sortBy(a, b, type));
    }
    return guilds.sort((a: Guild, b: Guild) => sortBy(b, a, type));
  }

  function getFilteredItems() {
    if (!filterOpen) {
      return guilds.filter((guild: Guild) =>
        guild.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return guilds.filter((guild: Guild) => {
      return (
        guild.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.realm.input !== ""
          ? parseModifier(
              filters.realm.modifier,
              guild.realm.toLowerCase(),
              filters.realm.input.toLowerCase()
            )
          : true) &&
        (filters.faction === "None"
          ? true
          : guild.faction.includes(filters.faction)) &&
        (filters.region === "None"
          ? true
          : guild.region.includes(filters.region))
      );
    });
  }

  function updateSearchParam(key: string, value: any) {
    page.url.searchParams.set(key, encodeURIComponent(value));
    goto(`?${page.url.searchParams.toString()}`);
  }
</script>

<Title title={t("title.guilds")}></Title>

<div>
  {#if guilds}
    <div style="position: relative;">
      <h4>{t("ui.guilds.guilds")}</h4>
      <div
        style={`display: grid; grid-template-columns: 30% 30%; justify-content: center; border-top: 1px solid black;`}
      >
        <span style="display: flex; justify-content: center;"
          ><input
            style="width: 100%;"
            placeholder={t("ui.placeholder.search")}
            class="textinput"
            bind:value={filters.search}
            id="search"
            name="search"
            spellcheck="false"
            autocomplete="off"
            onkeydown={(e: KeyboardEvent) => {
              if (e.key === "Escape") {
                filters.search = "";
              } else if (e.key === "Enter") {
                updateSearchParam("name", filters.search);
              }
            }}
            onfocusout={() => {
              updateSearchParam("name", filters.search);
            }}
          /></span
        >
        <span
          style="display: flex; justify-content: center; align-items: center; background-color: var(--palette-secondary-main); border: 1px solid black;"
          role="button"
          tabindex="0"
          title={t("ui.guilds.filter")}
          onkeydown={() => {}}
          onclick={() => (filterOpen = !filterOpen)}
          ><span class="text">{t("ui.guilds.filter")}</span></span
        >
      </div>
      {#if filterOpen}
        <div
          style={`display: grid; grid-template-columns: repeat(5, 12vw); justify-content: center; border-top: 1px solid black; background-color: var(--palette-secondary-dark)`}
        >
          <span style="display: block; justify-self: end;  min-width: 80px;"
            ><span
              style="display: flex; align-items: center; justify-items: center; height: 100%"
              >{t("ui.guilds.guildRegion")}</span
            ></span
          >
          <span style="display: block; justify-self: start;"
            ><select
              style="width: 12vw;"
              class="select"
              id="guildRegionSelect"
              name="guildRegionSelect"
              bind:value={filters.region}
              onchange={() => updateSearchParam("region", `${filters.region}`)}
            >
              <option value={"None"}>{t(`region.None`)}</option>
              {#each Object.keys(Region) as _region}
                <option value={_region.toLowerCase()}
                  >{t(`region.${_region}`)}</option
                >
              {/each}
            </select></span
          >
          <span style="display: block; justify-self: end;  min-width: 80px;"
            ><span
              style="display: flex; align-items: center; justify-items: center; height: 100%"
              >{t("ui.guilds.guildRealm")}</span
            ></span
          >
          <span style="display: block; justify-self: center;"
            ><select
              style="width: 12vw;"
              class="select"
              id="guildRealmSelect"
              name="guildRealmSelect"
              bind:value={filters.realm.modifier}
              onchange={() =>
                updateSearchParam(
                  "realm",
                  `${filters.realm.modifier}#${filters.realm.input}`
                )}
            >
              <option value="i">{t("ui.list.includes")}</option>
              <option value="sw">{t("ui.list.startsWith")}</option>
              <option value="ew">{t("ui.list.endsWith")}</option>
              <option value="eq">{t("ui.list.equal")}</option>
            </select></span
          >
          <span style="display: block; justify-self: start;  min-width: 80px;"
            ><input
              id="guildRealm"
              name="guildRealm"
              bind:value={filters.realm.input}
              placeholder={t("ui.placeholder.search")}
              type="text"
              class="textinput"
              spellcheck="false"
              autocomplete="off"
              onkeydown={(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  updateSearchParam(
                    "realm",
                    `${filters.realm.modifier}#${filters.realm.input}`
                  );
                }
              }}
              onfocusout={() => {
                updateSearchParam(
                  "realm",
                  `${filters.realm.modifier}#${filters.realm.input}`
                );
              }}
            /></span
          >
        </div>
        <div
          style={`display: grid; grid-template-columns: repeat(5, 12vw); justify-content: center; border-top: 1px solid black; background-color: var(--palette-secondary-dark)`}
        >
          <span style="display: block; justify-self: end;  min-width: 80px;"
            ><span
              style="display: flex; align-items: center; justify-items: center; height: 100%"
              >{t("ui.guilds.guildFaction")}</span
            ></span
          >
          <span style="display: block; justify-self: start;"
            ><select
              style="width: 12vw;"
              class="select"
              id="guildFactionSelect"
              name="guildFactionSelect"
              bind:value={filters.faction}
              onchange={() =>
                updateSearchParam("faction", `${filters.faction}`)}
            >
              <option value={"None"}>{t(`faction.None`)}</option>
              {#each gameVersionFactory.gameVersion.getFactions() as _faction}
                <option value={_faction.name}
                  >{t(`faction.${_faction.name}`)}</option
                >
              {/each}
            </select></span
          >
        </div>
      {/if}
      <div
        style={`display: grid; grid-template-columns: 20% 20% 20% 20% 20%; border: 1px solid black;`}
      >
        <span
          class="title-span"
          role="button"
          tabindex="0"
          onkeydown={() => {}}
          onclick={() => updateSort("name")}
          >{t("ui.guilds.guildName")}
        </span>
        <div style="display: grid; grid-template-columns: 70% 30%;">
          <span
            role="button"
            class="title-span"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("realm")}
            >{t("ui.guilds.guildRealm")}</span
          ><span
            role="button"
            class="title-span"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("region")}
            >{t("ui.guild.guildsRegion")}</span
          >
        </div>

        <span
          role="button"
          class="title-span"
          tabindex="0"
          onkeydown={() => {}}
          onclick={() => updateSort("faction")}
          >{t("ui.guilds.guildFaction")}</span
        >
        <span
          role="button"
          class="title-span"
          tabindex="0"
          onkeydown={() => {}}
          onclick={() => updateSort("member_count")}
          >{t("ui.guilds.guildMemberCount")}</span
        >
        {#if !["classic", "tbc"].includes(gameVersion)}
          <span
            class="title-span"
            role="button"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("achievement_points")}
            >{t("ui.armory.characterAchievementPoints")}</span
          >
        {/if}
      </div>
      {#if filtered_length === 0}
        <div
          style="display: block; align-self: center; justify-self: center; color: var(--item-quality-colour-Poor)"
        >
          {t("ui.list.noResults")}
        </div>
      {:else}
        <VirtualList
          style="height: 55vh; border-bottom: 1px solid black; overflow:auto; z-index: 0;"
          items={filtered_guilds}
        >
          {#snippet vl_slot({ index, item })}
            <div
              role="button"
              tabindex="0"
              class="div-item"
              onkeydown={() => {}}
              onclick={() => goto(`/${gameVersion}/guilds/${item.id}`)}
            >
              <span style="display: flex; align-items: center;"
                >{item.name}
                {#if accountState.guild === item.id}
                  <img
                    src="/image/ui/icon_home.png"
                    style="width: 16px; height: 16px;"
                    alt={t("ui.guild.owner")}
                  />
                {/if}
              </span>
              <div
                style="display: grid; grid-template-columns: 70% 30%; width: 100%; justify-items: center;"
              >
                <span>{item.realm} </span>
                <span>{item.region.toUpperCase()}</span>
              </div>

              <WarcraftIcon
                src={gameVersionFactory.gameVersion
                  .getFactions()
                  .find(
                    (_faction: PlayerFaction) => _faction.name === item.faction
                  )?.icon ?? ICON_QUESTIONMARK}
              ></WarcraftIcon>
              <span>{item.member_count}</span>
              <span>{item.achievement_points}</span>
            </div>
          {/snippet}
        </VirtualList>
        <div
          style="
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 25px;
      background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.5));
      pointer-events: none;
      justify-items: end;
    "
        ></div>
      {/if}
    </div>

    <span
      style="display: flex; justify-self: end; margin-right: 20px; color: var(--item-quality-colour-Poor); z-index: 0;"
      >{t(`ui.list.results`, {
        current: filtered_length,
        total: guilds.length,
      })}</span
    >
    {#if filtered_length <= 15}
      <SearchGuild
        search={filters.search}
        realm={filters.realm.input}
        region={filters.region}
      ></SearchGuild>
    {/if}
    {#if accountState.level > 0}
      <button
        type="button"
        class="button-base"
        style="margin-top: 25px; margin-left: 20px;"
        onclick={() => goto(`/${gameVersion}/guilds/add`)}
        >{t("ui.guild.add")}</button
      >
    {/if}
  {/if}
</div>

<style>
  .title-span {
    display: flex;
    height: 60px;
    width: 100%;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  span[role="button"]:hover {
    background-color: var(--palette-primary-dark);
  }

  .div-item {
    display: grid;
    grid-template-columns: repeat(5, 20%);
    justify-items: center;
    align-items: center;
    height: 32px;
  }
  .div-item:hover {
    background-color: var(--palette-primary-main);
  }
  h4 {
    padding-left: 20px;
  }
</style>

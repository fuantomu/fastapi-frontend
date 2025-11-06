<script lang="ts">
  import { goto } from "$app/navigation";
  import type {
    Account,
    Character,
    Guild,
    RosterCharacter,
    WCLGuildRanking,
  } from "$lib/types";
  import { getContext } from "svelte";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { t } from "$lib/i18n/index.svelte";
  import Title from "$lib/components/Title.svelte";
  import { page } from "$app/state";
  import { sortBy } from "$lib/helper/sort";
  import { VirtualList } from "svelte-virtuallists";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { PlayerRace } from "$lib/versions/PlayerRace";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { ICON_QUESTIONMARK, RealmVersion, Region } from "$lib/consts";
  import { PlayerClass } from "$lib/versions/PlayerClass";
  import { parseModifier } from "$lib/helper/parseFilter";
  import GuildDetailsFrame from "./GuildDetailsFrame.svelte";
  import DeleteGuild from "./DeleteGuild.svelte";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { getWCLColor } from "$lib/helper/wcl";
  import GuildDetailsEditFrame from "./GuildDetailsEditFrame.svelte";
  import { handleGuildSubmit } from "$lib/pages/guild";

  let { id } = $props<{
    id: number;
  }>();
  const gameVersion = getContext<GameVersionName>("gameVersion");
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let guild: Guild = $state({
    id: 0,
    name: "",
    realm: "",
    region: Region.EU,
    version: gameVersion,
    realm_version: RealmVersion.CLASSIC,
  } as Guild);
  let baseGuild: Guild = $state({} as Guild);
  let guilds: Guild[] = $state([]);
  let members: RosterCharacter[] = $state([]);
  let edit: boolean = $state(id == 0 ? true : false);
  let currentSort: string = $state("");
  let reverse: boolean = $state(false);
  let accountState = getContext<Account>("accountState");
  let filterOpen: boolean = $state(
    page.url.searchParams.size > 0 ? true : false
  );
  let filtered_members = $derived(getFilteredItems());
  let filtered_length = $derived(filtered_members.length);

  const wcl: { guild: WCLGuildRanking } = $state({
    guild: {} as WCLGuildRanking,
  });

  let filters: Record<string, any> = $state({
    search: page.url.searchParams.get("name") ?? "",
    level: getSearchParams("level", ">="),
    rank: getSearchParams("rank", ">="),
    race: page.url.searchParams.get("race") ?? "None",
    character_class: page.url.searchParams.get("character_class") ?? "None",
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
      return members.sort((a: RosterCharacter, b: RosterCharacter) =>
        sortBy(a, b, type)
      );
    }
    return members.sort((a: RosterCharacter, b: RosterCharacter) =>
      sortBy(b, a, type)
    );
  }

  function getFilteredItems(): RosterCharacter[] {
    if (!filterOpen) {
      return members.filter((member: RosterCharacter) =>
        member.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return members.filter((member: RosterCharacter) => {
      return (
        member.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.level.input !== ""
          ? parseModifier(
              filters.level.modifier,
              Number(member.level),
              Number(filters.level.input)
            )
          : true) &&
        (filters.rank.input !== ""
          ? parseModifier(
              filters.rank.modifier,
              Number(member.rank),
              Number(filters.rank.input)
            )
          : true) &&
        (filters.race === "None" ? true : member.race.includes(filters.race)) &&
        (filters.character_class === "None"
          ? true
          : member.character_class.includes(filters.character_class))
      );
    });
  }

  function updateSearchParam(key: string, value: any) {
    page.url.searchParams.set(key, encodeURIComponent(value));
    goto(`?${page.url.searchParams.toString()}`);
  }

  async function fetchGuildRanking() {
    if (!wcl.guild?.name) {
      const res = await fetch(
        `${PUBLIC_API_URL}/Warcraftlogs/Guild?guild=${guild.name}&server=${guild.realm}&region=${guild.region}&wcl_version=${guild.realm_version ?? "classic"}`
      );
      const data = await res.json();
      if (data.Result) {
        wcl.guild = data.Result;
      }
    }
  }

  async function fetchRoster() {
    const characters_res = await fetch(`${PUBLIC_API_URL}/Character/`);
    const characters_data = await characters_res.json();
    const characters: Character[] = characters_data.Result.filter(
      (character: Character) => character.guild == guild.id
    );

    const roster_res = await fetch(
      `${PUBLIC_API_URL}/Guild/Roster?name=${guild.name}&realm=${guild.realm}&region=${guild.region}&version=${gameVersion}`
    );
    const roster_data = await roster_res.json();
    let roster: RosterCharacter[] = roster_data.Result.map(
      (character: Record<string, any>) => character as RosterCharacter
    );

    members = roster.map((roster_member: RosterCharacter) => {
      const existing = characters.find(
        (character: Character) => character.id === roster_member.id
      );
      if (existing) {
        roster_member.parsed = true;
      } else {
        roster_member.parsed = false;
      }
      return roster_member;
    });
  }

  async function fetchGuilds() {
    const guilds_res = await fetch(
      `${PUBLIC_API_URL}/Guild?version=${gameVersion}`
    );
    const guilds_data = await guilds_res.json();
    guilds = guilds_data.Result;
  }

  async function fetchGuild() {
    const res = await fetch(`${PUBLIC_API_URL}/Guild?id=${id}`);
    const data = await res.json();
    guild = data.Result[0];
    baseGuild = data.Result[0];
  }

  let fetchData = async () => {
    if (id != 0) {
      await fetchGuild();
      await fetchRoster();
    }
    await fetchGuilds();
  };

  async function handleSubmit(new_guild: any) {
    const formData = new FormData();
    Object.keys(new_guild).forEach((key: string) => {
      formData.append(key, new_guild[key]);
    });
    const result = await handleGuildSubmit(formData);
    guild = JSON.parse(JSON.stringify(new_guild));
    if (new_guild.id === 0) {
      goto(
        `/${gameVersionFactory.gameVersion.getName()}${result}`
      );
    }
    edit = false;
  }
</script>

<Title
  title={id === 0 && edit
    ? t("title.guilds.addGuild")
    : t("title.guilds.showGuild") + ` - ${guild?.name ?? ""}`}
></Title>

<div>
  {#await fetchData() then}
    {#if members}
      <div style="position: relative;">
        <h4>{t("ui.guilds.guilds")}</h4>
        {#if edit}
          <div>
            <GuildDetailsEditFrame {guild} {guilds} {handleSubmit}
            ></GuildDetailsEditFrame>
          </div>
        {:else}
          <div style="display: grid; grid-template-columns: 20vw auto;">
            <GuildDetailsFrame
              {guild}
              guild_master={members.find(
                (member: RosterCharacter) => Number(member.rank) === 0
              ) ?? ({} as RosterCharacter)}
            ></GuildDetailsFrame>
            <div
              style="display: flex; align-content: end; height: 100%; margin-left: 40px;"
            >
              <div
                style="display: flex; justify-content: end; align-items: center; border: 1px solid black; padding: 20px"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://{guild.realm_version}.warcraftlogs.com/guild/id/{wcl
                    .guild.id}"
                >
                  <img
                    style="height: 32px; width: 32px"
                    src="/image/external/wcl.png"
                    alt="Warcraftlogs"
                  />
                </a>
                {#await fetchGuildRanking() then}
                  <div
                    style="display: flex; flex-direction: column; margin-left: 20px; gap: 10px"
                  >
                    <span
                      style="font-size: larger; font-weight: bold; display: flex; justify-content: center"
                      >{t("ui.ranking.progress")}</span
                    >
                    <div>
                      <div
                        style="display: flex; align-content: center; justify-content: center; gap: 15px; font-size:medium;"
                      >
                        <span>{t("ui.ranking.world")}</span>
                        <span
                          style="color: var(--ui-colour-wcl-{getWCLColor(
                            wcl.guild.zoneRanking?.progress?.worldRank.color ??
                              'common'
                          )});"
                          >{wcl.guild.zoneRanking?.progress?.worldRank.number ??
                            "-"}</span
                        >
                      </div>
                      <div
                        style="display: flex; align-content: center; justify-items: space-between; gap: 15px; font-size:medium;"
                      >
                        <div
                          style="display: block; align-content: center; justify-items: center;"
                        >
                          <span>{t("ui.ranking.region")}</span>
                          <span
                            style="color: var(--ui-colour-wcl-{getWCLColor(
                              wcl.guild.zoneRanking?.progress?.regionRank
                                .color ?? 'common'
                            )});"
                            >{wcl.guild.zoneRanking?.progress?.regionRank
                              .number ?? "-"}</span
                          >
                        </div>
                        <div
                          style="display: block; align-content: center; justify-items: center;"
                        >
                          <span>{t("ui.ranking.server")}</span>
                          <span
                            style="color: var(--ui-colour-wcl-{getWCLColor(
                              wcl.guild.zoneRanking?.progress?.serverRank
                                .color ?? 'common'
                            )});"
                            >{wcl.guild.zoneRanking?.progress?.serverRank
                              .number ?? "-"}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style="display: flex; flex-direction: column; margin-left: 20px; gap: 10px"
                  >
                    <span
                      style="font-size: larger; font-weight: bold; display: flex; justify-content: center"
                      >{t("ui.ranking.speed")}</span
                    >
                    <div>
                      <div
                        style="display: flex; align-content: center; justify-content: center; gap: 15px; font-size:medium;"
                      >
                        <span>{t("ui.ranking.world")}</span>
                        <span
                          style="color: var(--ui-colour-wcl-{getWCLColor(
                            wcl.guild.zoneRanking?.completeRaidSpeed?.worldRank
                              .color ?? 'common'
                          )});"
                          >{wcl.guild.zoneRanking?.completeRaidSpeed?.worldRank
                            .number ?? "-"}</span
                        >
                      </div>
                      <div
                        style="display: flex; align-content: center; justify-items: space-between; gap: 15px; font-size:medium;"
                      >
                        <div
                          style="display: block; align-content: center; justify-items: center;"
                        >
                          <span>{t("ui.ranking.region")}</span>
                          <span
                            style="color: var(--ui-colour-wcl-{getWCLColor(
                              wcl.guild.zoneRanking?.completeRaidSpeed
                                ?.regionRank.color ?? 'common'
                            )});"
                            >{wcl.guild.zoneRanking?.completeRaidSpeed
                              ?.regionRank.number ?? "-"}</span
                          >
                        </div>
                        <div
                          style="display: block; align-content: center; justify-items: center;"
                        >
                          <span>{t("ui.ranking.server")}</span>
                          <span
                            style="color: var(--ui-colour-wcl-{getWCLColor(
                              wcl.guild.zoneRanking?.completeRaidSpeed
                                ?.serverRank.color ?? 'common'
                            )});"
                            >{wcl.guild.zoneRanking?.completeRaidSpeed
                              ?.serverRank.number ?? "-"}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                {/await}
              </div>
            </div>
          </div>
        {/if}
        {#if accountState.level > 0}
          <DeleteGuild {guild}></DeleteGuild>
          <button
            type="button"
            class="button-base"
            style="margin-top: 25px; margin-left: 20px;"
            onclick={() => {
              if (window.location.href.includes("/guilds/add")) {
                goto(`/${gameVersionFactory.gameVersion.getName()}/guilds`);
              } else {
                if (edit) {
                  guild = baseGuild;
                  edit = false;
                } else {
                  edit = true;
                }
              }
            }}>{t(edit ? `ui.guild.cancel` : `ui.guild.edit`)}</button
          >
        {/if}
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
                >{t("ui.guilds.memberRace")}</span
              ></span
            >
            <span style="display: block; justify-self: start;"
              ><select
                style="width: 12vw;"
                class="select"
                id="memberRaceSelect"
                name="memberRaceSelect"
                bind:value={filters.race}
                onchange={() => updateSearchParam("race", `${filters.race}`)}
              >
                <option value={"None"}>{t(`race.None`)}</option>
                {#each gameVersionFactory.gameVersion.getRaces() as race}
                  <option value={race.name}>{t(`race.${race.name}`)}</option>
                {/each}
              </select></span
            >
            <span style="display: block; justify-self: end;  min-width: 80px;"
              ><span
                style="display: flex; align-items: center; justify-items: center; height: 100%"
                >{t("ui.guilds.memberLevel")}</span
              ></span
            >
            <span style="display: block; justify-self: center;"
              ><select
                style="width: 12vw;"
                class="select"
                id="memberLevelSelect"
                name="memberLevelSelect"
                bind:value={filters.level.modifier}
                onchange={() =>
                  updateSearchParam(
                    "level",
                    `${filters.level.modifier}#${filters.level.input}`
                  )}
              >
                <option value=">">{t("ui.list.greaterThan")}</option>
                <option value=">=">{t("ui.list.greaterThanEqual")}</option>
                <option value="=">{t("ui.list.equal")}</option>
                <option value="<">{t("ui.list.lessThan")}</option>
                <option value="<=">{t("ui.list.lessThanEqual")}</option>
              </select></span
            >
            <span style="display: block; justify-self: start;  min-width: 80px;"
              ><input
                id="memberLevel"
                name="memberLevel"
                bind:value={filters.level.input}
                placeholder="0"
                type="number"
                class="textinput"
                spellcheck="false"
                autocomplete="off"
                onkeydown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    updateSearchParam(
                      "level",
                      `${filters.level.modifier}#${filters.level.input}`
                    );
                  }
                }}
                onfocusout={() => {
                  updateSearchParam(
                    "level",
                    `${filters.level.modifier}#${filters.level.input}`
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
                >{t("ui.guilds.memberClass")}</span
              ></span
            >
            <span style="display: block; justify-self: start;"
              ><select
                style="width: 12vw;"
                class="select"
                id="memberClassSelect"
                name="memberClassSelect"
                bind:value={filters.character_class}
                onchange={() =>
                  updateSearchParam(
                    "character_class",
                    `${filters.character_class}`
                  )}
              >
                <option value={"None"}>{t(`classes.None`)}</option>
                {#each gameVersionFactory.gameVersion.getClasses() as _class}
                  <option value={_class.name}
                    >{t(`classes.${_class.name}`)}</option
                  >
                {/each}
              </select></span
            >
            <span style="display: block; justify-self: end;  min-width: 80px;"
              ><span
                style="display: flex; align-items: center; justify-items: center; height: 100%"
                >{t("ui.guilds.memberRank")}</span
              ></span
            >
            <span style="display: block; justify-self: center;"
              ><select
                style="width: 12vw;"
                class="select"
                id="memberRankSelect"
                name="memberRankSelect"
                bind:value={filters.rank.modifier}
                onchange={() =>
                  updateSearchParam(
                    "rank",
                    `${filters.rank.modifier}#${filters.rank.input}`
                  )}
              >
                <option value=">">{t("ui.list.greaterThan")}</option>
                <option value=">=">{t("ui.list.greaterThanEqual")}</option>
                <option value="=">{t("ui.list.equal")}</option>
                <option value="<">{t("ui.list.lessThan")}</option>
                <option value="<=">{t("ui.list.lessThanEqual")}</option>
              </select></span
            >
            <span style="display: block; justify-self: start;  min-width: 80px;"
              ><input
                id="memberRank"
                name="memberRank"
                bind:value={filters.rank.input}
                placeholder="0"
                type="number"
                class="textinput"
                spellcheck="false"
                autocomplete="off"
                onkeydown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    updateSearchParam(
                      "rank",
                      `${filters.rank.modifier}#${filters.rank.input}`
                    );
                  }
                }}
                onfocusout={() => {
                  updateSearchParam(
                    "rank",
                    `${filters.rank.modifier}#${filters.rank.input}`
                  );
                }}
              /></span
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
            >{t("ui.guilds.memberName")}
          </span>
          <span
            class="title-span"
            role="button"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("rank")}
            >{t("ui.guilds.memberRank")}
          </span>
          <span
            class="title-span"
            role="button"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("level")}
            >{t("ui.guilds.memberLevel")}
          </span>
          <span
            class="title-span"
            role="button"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("race")}
            >{t("ui.guilds.memberRace")}
          </span>
          <span
            class="title-span"
            role="button"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("character_class")}
            >{t("ui.guilds.memberClass")}
          </span>
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
            items={filtered_members}
          >
            {#snippet vl_slot({ index, item })}
              <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
              <div
                role={item.parsed ? "button" : "row"}
                tabindex={item.parsed ? 0 : -1}
                class="div-item"
                onkeydown={() => {}}
                onclick={() => {
                  if (item.parsed) {
                    goto(`/${gameVersion}/armory/characters/${item.id}`);
                  }
                }}
              >
                <span style="display: flex; align-items: center;"
                  >{item.name}
                  {#if accountState.characters?.includes(item.id)}
                    <img
                      src="/image/ui/icon_home.png"
                      style="width: 16px; height: 16px;"
                      alt={t("ui.armory.owner")}
                    />
                  {/if}
                </span>
                <span style="display: flex; align-items: center;">
                  {#if item.rank === 0}
                    <img
                      src="/image/ui/icon_leader.png"
                      style="width: 16px; height: 16px;"
                      alt={t("ui.guilds.master")}
                    />
                  {:else}
                    {item.rank}
                  {/if}
                </span>
                <span style="display: flex; align-items: center;">
                  {item.level}
                </span>
                <WarcraftIcon
                  size={36}
                  src={gameVersionFactory.gameVersion
                    .getRaces()
                    .find((_race: PlayerRace) => _race.name === item.race)
                    ?.icon_male ?? ICON_QUESTIONMARK}
                ></WarcraftIcon>
                <WarcraftIcon
                  src={gameVersionFactory.gameVersion
                    .getClasses()
                    .find(
                      (_class: PlayerClass) =>
                        _class.name === item.character_class
                    )?.icon ?? ICON_QUESTIONMARK}
                ></WarcraftIcon>
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
          total: members.length,
        })}</span
      >
    {/if}
  {/await}
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

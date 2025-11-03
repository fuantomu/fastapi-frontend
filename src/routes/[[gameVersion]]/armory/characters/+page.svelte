<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Account, Character, Guild } from "$lib/types";
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
  import { PlayerSpec } from "$lib/versions/PlayerSpecialization";
  import WarcraftIcon from "$lib/components/WarcraftIcon.svelte";
  import { Gender, ICON_QUESTIONMARK, Region } from "$lib/consts";
  import { PlayerClass } from "$lib/versions/PlayerClass";
  import { PlayerRace } from "$lib/versions/PlayerRace";
  import { PlayerFaction } from "$lib/versions/PlayerFaction";

  let { data }: PageProps = $props();
  let characters: Character[] = $state(data.items ?? []);
  let currentSort: string = $state("");
  let reverse: boolean = $state(false);
  const gameVersion = getContext<GameVersionName>("gameVersion");
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let accountState = getContext<Account>("accountState");
  let guilds: Guild[] = $state(data.guilds ?? []);
  let filterOpen: boolean = $state(
    page.url.searchParams.size > 0 ? true : false
  );

  let filters: Record<string, any> = $state({
    search: page.url.searchParams.get("name") ?? "",
    level: getSearchParams("level", ">"),
    guild: getSearchParams("guild"),
    race: page.url.searchParams.get("race") ?? "None",
    realm: getSearchParams("realm"),
    region: page.url.searchParams.get("region") ?? "None",
    faction: page.url.searchParams.get("faction") ?? "None",
    character_class: page.url.searchParams.get("character_class") ?? "None",
    active_spec: page.url.searchParams.get("active_spec") ?? "None",
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
      return characters.sort((a: Character, b: Character) =>
        sortBy(a, b, type)
      );
    }
    return characters.sort((a: Character, b: Character) => sortBy(b, a, type));
  }

  function getFilteredItems() {
    if (!filterOpen) {
      return characters.filter((character: Character) =>
        character.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return characters.filter((character: Character) => {
      return (
        character.name.includes(filters.search) &&
        (filters.level.input !== ""
          ? parseModifier(
              filters.level.modifier,
              Number(character.level),
              Number(filters.level.input)
            )
          : true) &&
        (filters.guild.input !== ""
          ? parseModifier(
              filters.guild.modifier,
              guilds
                .find((guild: Guild) => guild.id === character.guild)
                ?.name.toLowerCase() ?? "",
              filters.guild.input.toLowerCase()
            )
          : true) &&
        (filters.realm.input !== ""
          ? parseModifier(
              filters.realm.modifier,
              character.realm.toLowerCase(),
              filters.realm.input.toLowerCase()
            )
          : true) &&
        (filters.race === "None"
          ? true
          : character.race.includes(filters.race)) &&
        (filters.faction === "None"
          ? true
          : character.faction.includes(filters.faction)) &&
        (filters.character_class === "None"
          ? true
          : character.character_class.includes(filters.character_class)) &&
        (filters.region === "None"
          ? true
          : character.region.includes(filters.region)) &&
        (filters.active_spec === "None"
          ? true
          : character.active_spec.includes(filters.active_spec))
      );
    });
  }

  function updateSearchParam(key: string, value: any) {
    page.url.searchParams.set(key, encodeURIComponent(value));
    goto(`?${page.url.searchParams.toString()}`);
  }

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
</script>

<Title title={t("title.armory.characters")}></Title>

<div>
  {#if characters}
    <div style="position: relative;">
      <h4>{t("ui.armory.character")}</h4>
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
          title={t("ui.character.filter")}
          onkeydown={() => {}}
          onclick={() => (filterOpen = !filterOpen)}
          ><span class="text">{t("ui.character.filter")}</span></span
        >
      </div>
      {#if filterOpen}
        <div
          style={`display: grid; grid-template-columns: repeat(5, 12vw); justify-content: center; border-top: 1px solid black; background-color: var(--palette-secondary-dark)`}
        >
          <span style="display: block; justify-self: end;  min-width: 80px;"
            ><span
              style="display: flex; align-items: center; justify-items: center; height: 100%"
              >{t("ui.armory.characterRegion")}</span
            ></span
          >
          <span style="display: block; justify-self: start;"
            ><select
              style="width: 12vw;"
              class="select"
              id="characterRegionSelect"
              name="characterRegionSelect"
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
              >{t("ui.armory.characterRealm")}</span
            ></span
          >
          <span style="display: block; justify-self: center;"
            ><select
              style="width: 12vw;"
              class="select"
              id="characterRealmSelect"
              name="characterRealmSelect"
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
              id="characterRealm"
              name="characterRealm"
              bind:value={filters.realm.input}
              placeholder={t("ui.placeholder.search")}
              type="text"
              class="textinput"
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
              >{t("ui.armory.characterRace")}</span
            ></span
          >
          <span style="display: block; justify-self: start;"
            ><select
              style="width: 12vw;"
              class="select"
              id="characterRaceSelect"
              name="characterRaceSelect"
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
              >{t("ui.armory.characterLevel")}</span
            ></span
          >
          <span style="display: block; justify-self: center;"
            ><select
              style="width: 12vw;"
              class="select"
              id="characterLevelSelect"
              name="characterLevelSelect"
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
              id="characterLevel"
              name="characterLevel"
              bind:value={filters.level.input}
              placeholder="0"
              type="number"
              class="textinput"
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
              >{t("ui.armory.characterClass")}</span
            ></span
          >
          <span style="display: block; justify-self: start;"
            ><select
              style="width: 12vw;"
              class="select"
              id="characterClassSelect"
              name="characterClassSelect"
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
              >{t("ui.armory.characterGuild")}</span
            ></span
          >
          <span style="display: block; justify-self: center;"
            ><select
              style="width: 12vw;"
              class="select"
              id="characterGuildSelect"
              name="characterGuildSelect"
              bind:value={filters.guild.modifier}
              onchange={() =>
                updateSearchParam(
                  "guild",
                  `${filters.guild.modifier}#${filters.guild.input}`
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
              id="characterGuild"
              name="characterGuild"
              bind:value={filters.guild.input}
              placeholder={t("ui.placeholder.search")}
              type="text"
              class="textinput"
              onkeydown={(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  updateSearchParam(
                    "guild",
                    `${filters.guild.modifier}#${filters.guild.input}`
                  );
                }
              }}
              onfocusout={() => {
                updateSearchParam(
                  "guild",
                  `${filters.guild.modifier}#${filters.guild.input}`
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
              >{t("ui.armory.characterFaction")}</span
            ></span
          >
          <span style="display: block; justify-self: start;"
            ><select
              style="width: 12vw;"
              class="select"
              id="characterFactionSelect"
              name="characterFactionSelect"
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
          <span style="display: block; justify-self: end;  min-width: 80px;"
            ><span
              style="display: flex; align-items: center; justify-items: center; height: 100%"
              >{t("ui.armory.characterSpec")}</span
            ></span
          >
          <span style="display: block; justify-self: start;"
            ><select
              style="width: 12vw;"
              class="select"
              id="characterSpecSelect"
              name="characterSpecSelect"
              bind:value={filters.active_spec}
              onchange={() =>
                updateSearchParam("active_spec", `${filters.active_spec}`)}
            >
              <option value={"None"}>{t(`specs.None`)}</option>
              {#each gameVersionFactory.gameVersion
                .getSpecs()
                .filter( (_spec: PlayerSpec) => _spec.name.includes(filters.character_class) ) as _spec}
                <option value={_spec.name.replace(filters.character_class, "")}
                  >{t(`specs.${_spec.name}`)}</option
                >
              {/each}
            </select></span
          >
        </div>
      {/if}
      <div
        style={`display: grid; grid-template-columns: 25% 10% 20% 5% 25% 15%; border: 1px solid black;`}
      >
        <span
          class="title-span"
          role="button"
          tabindex="0"
          onkeydown={() => {}}
          onclick={() => updateSort("name")}
          >{t("ui.armory.characterName")}
        </span>
        <div style="display: grid; grid-template-columns: 70% 30%;">
          <span
            role="button"
            class="title-span"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("realm")}
            >{t("ui.armory.characterRealm")}</span
          ><span
            role="button"
            class="title-span"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("region")}
            >{t("ui.armory.characterRegion")}</span
          >
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr);">
          <span
            role="button"
            class="title-span"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("race")}
            >{t("ui.armory.characterRace")}</span
          ><span
            role="button"
            class="title-span"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("faction")}
            >{t("ui.armory.characterFaction")}</span
          ><span
            role="button"
            class="title-span"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("character_class")}
            >{t("ui.armory.characterClass")}</span
          ><span
            role="button"
            class="title-span"
            tabindex="0"
            onkeydown={() => {}}
            onclick={() => updateSort("active_spec")}
            >{t("ui.armory.characterSpec")}</span
          >
        </div>
        <span
          class="title-span"
          role="button"
          tabindex="0"
          onkeydown={() => {}}
          onclick={() => updateSort("level")}
          >{t("ui.armory.characterLevel")}</span
        >
        <span
          class="title-span"
          role="button"
          tabindex="0"
          onkeydown={() => {}}
          onclick={() => updateSort("guild")}
          >{t("ui.armory.characterGuild")}</span
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
      <VirtualList
        style="height: 55vh; border-bottom: 1px solid black; overflow:auto; z-index: 0;"
        items={getFilteredItems()}
      >
        {#snippet vl_slot({ index, item })}
          <div
            role="button"
            tabindex="0"
            class="div-item"
            onkeydown={() => {}}
            onclick={() => goto(`/${gameVersion}/armory/characters/${item.id}`)}
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
            <div
              style="display: grid; grid-template-columns: 70% 30%; width: 100%; justify-items: center;"
            >
              <span>{item.realm} </span>
              <span>{item.region.toUpperCase()}</span>
            </div>
            <div
              style="display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; justify-items: center;"
            >
              <WarcraftIcon src={getRaceIcon(item.race, item.gender)}
              ></WarcraftIcon>
              <WarcraftIcon
                src={gameVersionFactory.gameVersion
                  .getFactions()
                  .find(
                    (_faction: PlayerFaction) => _faction.name === item.faction
                  )?.icon ?? ICON_QUESTIONMARK}
              ></WarcraftIcon>
              <WarcraftIcon
                src={gameVersionFactory.gameVersion
                  .getClasses()
                  .find(
                    (_class: PlayerClass) =>
                      _class.name === item.character_class
                  )?.icon ?? ICON_QUESTIONMARK}
              ></WarcraftIcon>
              <WarcraftIcon
                src={gameVersionFactory.gameVersion
                  .getSpecs()
                  .find(
                    (spec: PlayerSpec) =>
                      spec.name === `${item.character_class}${item.active_spec}`
                  )?.icon ?? ICON_QUESTIONMARK}
              ></WarcraftIcon>
            </div>
            <span>{item.level}</span>
            {#if item.guild !== null}
              <span
                >{guilds.find((guild: Guild) => guild.id === item.guild)
                  ?.name}</span
              >
            {:else}
              <span style="color: var(--item-quality-colour-Poor);"
                >{t("ui.armory.noGuild")}</span
              >
            {/if}
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
      >
        
      </div>
      
    </div>
    <span
          style="display: flex; justify-self: end; margin-right: 20px; color: var(--item-quality-colour-Poor); z-index: 0;"
          >{t(`ui.list.results`, {
            current: getFilteredItems().length,
            total: characters.length,
          })}</span
        >
    {#if accountState.level > 0}
      <button
        type="button"
        class="button-base"
        style="margin-top: 25px; margin-left: 20px;"
        onclick={() => goto(`/${gameVersion}/armory/characters/add`)}
        >{t("ui.character.add")}</button
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
    grid-template-columns: 25% 10% 20% 5% 25% 15%;
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

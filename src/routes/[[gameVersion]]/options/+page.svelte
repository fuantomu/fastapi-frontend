<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { PUBLIC_API_URL } from "$env/static/public";
  import Title from "$lib/components/Title.svelte";
  import { sortBy } from "$lib/helper/sort";
  import { t } from "$lib/i18n/index.svelte";
  import type { Account, Character, Guild } from "$lib/types";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import { VirtualList } from "svelte-virtuallists";
  import { parseModifier } from "$lib/helper/parseFilter";

  let accounts: Account[] = $state([]);
  let currentSort: string = $state("");
  let reverse: boolean = $state(false);
  const gameVersion = getContext<GameVersionName>("gameVersion");
  let accountState = getContext<Account>("accountState");
  let guilds: Guild[] = $state([]);
  let characters: Character[] = $state([]);
  let filterOpen: boolean = $state(
    page.url.searchParams.size > 0 ? true : false
  );
  let filtered_accounts = $derived(getFilteredItems());
  let filtered_length = $derived(filtered_accounts.length);

  const filters: Record<string, any> = $state({
    search: page.url.searchParams.get("name") ?? "",
    level: getSearchParams("level", ">"),
    guild: getSearchParams("guild"),
    characters: getSearchParams("character"),
  });

  async function getAccounts() {
    const response = await fetch(`${PUBLIC_API_URL}/Account/`, {
      method: "GET",
    });
    const data = await response.json();
    accounts = data["Result"];
    accounts.sort((a: Account, b: Account) => sortBy(a, b, "username"));
  }

  async function getGuilds() {
    const response = await fetch(
      `${PUBLIC_API_URL}/Guild/?version=${gameVersion}`,
      {
        method: "GET",
      }
    );
    const response_data = await response.json();
    guilds = response_data["Result"];
  }

  async function getCharacters() {
    const response = await fetch(
      `${PUBLIC_API_URL}/Character/?version=${gameVersion}`,
      {
        method: "GET",
      }
    );
    const response_data = await response.json();
    characters = response_data["Result"];
  }

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

  let fetchData = async () => {
    if (accountState.level !== 1) {
      return goto(`/${gameVersion}/`);
    }
    await getAccounts();
    await getGuilds();
    await getCharacters();
  };

  function updateSort(type: string) {
    currentSort === type ? (reverse = !reverse) : (reverse = false);
    currentSort = type;
    switch (type) {
      case "characters":
        if (reverse) {
          return accounts.sort((a: Account, b: Account) =>
            b.characters.length > a.characters.length ? 0 : -1
          );
        }
        return accounts.sort((a: Account, b: Account) =>
          a.characters.length > b.characters.length ? 0 : -1
        );
      default:
        if (reverse) {
          return accounts.sort((a: Account, b: Account) => sortBy(b, a, type));
        }
        return accounts.sort((a: Account, b: Account) => sortBy(a, b, type));
    }
  }

  function getFilteredItems() {
    if (!filterOpen) {
      return accounts.filter((account: Account) =>
        account.username.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    return accounts.filter((account: Account) => {
      return (
        account.username.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.level.input !== ""
          ? parseModifier(
              filters.level.modifier,
              Number(account.level),
              Number(filters.level.input)
            )
          : true) &&
        (filters.guild.input !== ""
          ? parseModifier(
              filters.guild.modifier,
              guilds
                .find((guild: Guild) => guild.id === account.guild)
                ?.name.toLowerCase() ?? "",
              filters.guild.input.toLowerCase()
            )
          : true) &&
        (filters.characters.input !== ""
          ? account.characters.some((character: number) =>
              parseModifier(
                filters.characters.modifier,
                characters
                  .find(
                    (other_character: Character) =>
                      other_character.id === character
                  )
                  ?.name.toLowerCase() ?? "",
                filters.characters.input.toLowerCase()
              )
            )
          : true)
      );
    });
  }

  function updateSearchParam(key: string, value: any) {
    page.url.searchParams.set(key, encodeURIComponent(value));
    goto(`?${page.url.searchParams.toString()}`);
  }
</script>

<Title title={t("title.options")}></Title>
{#await fetchData() then}
  <div style="position: relative;">
    <h4>{t("ui.options.accounts")}</h4>
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
        title={t("ui.options.filter")}
        onkeydown={() => {}}
        onclick={() => (filterOpen = !filterOpen)}
        ><span class="text">{t("ui.options.filter")}</span></span
      >
    </div>
    {#if filterOpen}
      <div
        style={`display: grid; grid-template-columns: 42% 16% 42%; border-top: 1px solid black; background-color: var(--palette-secondary-dark)`}
      >
        <span style="display: block; justify-self: end;  min-width: 80px;"
          ><span
            style="display: flex; align-items: center; justify-items: center; height: 100%"
            >{t("ui.options.accountLevel")}</span
          ></span
        >
        <span style="display: block; justify-self: center;  width: 70%;"
          ><select
            style="width: 100%;"
            class="select"
            id="accountLevelSelect"
            name="accountLevelSelect"
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
            id="accountLevel"
            name="accountLevel"
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
        style={`display: grid; grid-template-columns: 42% 16% 42%; border-top: 1px solid black; background-color: var(--palette-secondary-dark)`}
      >
        <span style="display: block; justify-self: end;  min-width: 80px;"
          ><span
            style="display: flex; align-items: center; justify-items: center; height: 100%"
            >{t("ui.options.accountGuild")}</span
          ></span
        >
        <span style="display: block; justify-self: center;  width: 70%;"
          ><select
            style="width: 100%;"
            class="select"
            id="accountGuildSelect"
            name="accountGuildSelect"
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
            id="accountGuild"
            name="accountGuild"
            bind:value={filters.guild.input}
            placeholder={t("ui.placeholder.search")}
            type="text"
            class="textinput"
            spellcheck="false"
            autocomplete="off"
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
        style={`display: grid; grid-template-columns: 42% 16% 42%; border-top: 1px solid black; background-color: var(--palette-secondary-dark)`}
      >
        <span style="display: block; justify-self: end;  min-width: 80px;"
          ><span
            style="display: flex; align-items: center; justify-items: center; height: 100%"
            >{t("ui.options.accountCharacter")}</span
          ></span
        >
        <span style="display: block; justify-self: center;  width: 70%;"
          ><select
            style="width: 100%;"
            class="select"
            id="accountCharacterSelect"
            name="accountCharacterSelect"
            bind:value={filters.characters.modifier}
            onchange={() =>
              updateSearchParam(
                "characters",
                `${filters.characters.modifier}#${filters.characters.input}`
              )}
          >
            <option value="i">{t("ui.list.includes")}</option>
            <option value="eq">{t("ui.list.equal")}</option>
          </select></span
        >
        <span style="display: block; justify-self: start;  min-width: 80px;"
          ><input
            id="accountCharacter"
            name="accountCharacter"
            bind:value={filters.characters.input}
            placeholder={t("ui.placeholder.search")}
            type="text"
            class="textinput"
            spellcheck="false"
            autocomplete="off"
            onkeydown={(e: KeyboardEvent) => {
              if (e.key === "Enter") {
                updateSearchParam(
                  "characters",
                  `${filters.characters.modifier}#${filters.characters.input}`
                );
              }
            }}
            onfocusout={() => {
              updateSearchParam(
                "characters",
                `${filters.characters.modifier}#${filters.characters.input}`
              );
            }}
          /></span
        >
      </div>
    {/if}
    <div
      style={`display: grid; grid-template-columns: repeat(5, 1fr); border: 1px solid black;`}
    >
      <span
        class="title-span"
        role="button"
        tabindex="0"
        onkeydown={() => {}}
        onclick={() => updateSort("username")}
        >{t("ui.options.accountName")}
      </span>
      <span
        class="title-span"
        role="button"
        tabindex="0"
        onkeydown={() => {}}
        onclick={() => updateSort("level")}>{t("ui.options.accountLevel")}</span
      >
      <span
        class="title-span"
        role="button"
        tabindex="0"
        onkeydown={() => {}}
        onclick={() => updateSort("creation_time")}
        >{t("ui.options.accountCreation")}</span
      >
      <span
        class="title-span"
        role="button"
        tabindex="0"
        onkeydown={() => {}}
        onclick={() => updateSort("guild")}>{t("ui.options.accountGuild")}</span
      >
      <span
        class="title-span"
        role="button"
        tabindex="0"
        onkeydown={() => {}}
        onclick={() => updateSort("characters")}
        >{t("ui.options.accountCharacters")}</span
      >
    </div>
    <VirtualList
      style="height:55vh; border-bottom: 1px solid black; overflow:auto; z-index: 0;"
      items={filtered_accounts}
    >
      {#snippet vl_slot({ index, item })}
        <a
          href="/{gameVersion}/options/{item.username}"
          style="text-decoration: none; color: inherit;"
        >
          <div class="div-item">
            <span style="display: flex; align-items: center;"
              >{item.username}
              {#if item.username.toLowerCase() === accountState.username.toLowerCase()}
                <img
                  src="/image/ui/icon_home.png"
                  style="width: 16px; height: 16px;"
                  alt={t("ui.options.owner")}
                />
              {/if}
            </span>
            <span>{item.level}</span>
            <span>{new Date(item.creation_time * 1000).toISOString()}</span>
            {#if item.guild !== -1}
              <span
                >{guilds.find((guild: Guild) => guild.id === item.guild)
                  ?.name}</span
              >
            {:else}
              <span style="color: var(--item-quality-colour-Poor);"
                >{t("ui.options.noGuild")}</span
              >
            {/if}

            {#if item.characters.length > 0}
              <span
                >{item.characters
                  .map(
                    (character: number) =>
                      characters.find(
                        (other_character: Character) =>
                          other_character.id === character
                      )?.name
                  )
                  ?.join(",")}</span
              >
            {:else}
              <span style="color: var(--item-quality-colour-Poor);"
                >{t("ui.options.noCharacters")}</span
              >
            {/if}
          </div>
        </a>
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
  </div>
  <span
    style="display: flex; justify-self: end; margin-right: 20px; color: var(--item-quality-colour-Poor); z-index: 0;"
    >{t(`ui.list.results`, {
      current: filtered_accounts.length,
      total: accounts.length,
    })}</span
  >
  <button
    type="button"
    class="button-base"
    style="margin-top: 25px; margin-left: 20px;"
    onclick={() => goto(`/${gameVersion}/options/add`)}
    >{t("ui.account.add")}</button
  >
{/await}

<style>
  .title-span {
    display: flex;
    height: 60px;
    width: 100%;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .title-span:hover {
    background-color: var(--palette-primary-dark);
  }

  .div-item {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
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

<script lang="ts">
  import { PUBLIC_API_URL } from "$env/static/public";
  import Title from "$lib/components/Title.svelte";
  import { t } from "$lib/i18n/index.svelte";
  import type { Account, Character, Guild } from "$lib/types";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import { goto } from "$app/navigation";
  import MultiSelect from "svelte-multiselect";
  import { enhance } from "$app/forms";

  const gameVersion = getContext<GameVersionName>("gameVersion");
  let accountState = getContext<Account>("accountState");
  let account: Account = $state({} as Account);
  let accountCharacters: string[] = $state([]);
  let guilds: Guild[] = $state([]);
  let characters: Character[] = $state([]);
  let infoMessage: string = $state("");
  let showPassword: boolean = $state(false);

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

  let fetchData = async () => {
    if (accountState.level !== 1) {
      return goto(`/${gameVersion}/`);
    }
    await getGuilds();
    await getCharacters();
  };
</script>

{#await fetchData() then}
  <Title title={t("title.options.createAccount")}></Title>
  <form
    method="POST"
    use:enhance={() => {
      return async ({ result }) => {
        if (result.type === "success") {
          if (result.data && result.data.status === 400) {
            infoMessage = t("ui.account.exists");
            return;
          }
          goto(`/${gameVersion}/options`);
        }
      };
    }}
  >
    <div
      style="display: flex; flex-direction: column; height: fit-content; padding: 50px; gap: 5px;"
    >
      {#if infoMessage}
        <span class="error">{infoMessage}</span>
      {/if}

      <div style="grid-template-columns: 40% 30%" class="row">
        <span>{t("ui.account.username")}</span>
        <div>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Username"
            spellcheck="false"
            autocomplete="off"
            bind:value={account.username}
            oninput={() => (infoMessage = "")}
            class="textinput"
            required
            title={t("ui.account.username")}
          />
        </div>
      </div>
      <div style="grid-template-columns: 40% 60%" class="row">
        <span>{t("ui.account.password")}</span>
        <div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            spellcheck="false"
            autocomplete="off"
            bind:value={account.hash}
            class="textinput"
            required
            title={t("ui.account.password")}
          />
          <button
            type="button"
            onmousedown={() => {
              showPassword = true;
            }}
            onmouseup={() => {
              showPassword = false;
            }}
            style="
              position: absolute; 
              display: inline-block;
              bottom: 1px;
              left: 376px; 
              height: 26px; 
              width: 26px;
              border: none;
              padding: none;
              background: transparent"
            title={t("ui.button.showPassword")}
            ><img
              src="/image/ui/icon_eye.png"
              style="position: absolute; bottom: 0px; left: 0px; width: 32px; height: 32px;"
              alt={t("ui.button.showPassword")}
            /></button
          >
          <button
            type="button"
            class="button-base"
            onclick={() =>
              (account.hash = btoa(
                window.crypto.randomUUID().toString().slice(0, 16)
              ))}>{t("ui.account.generatePassword")}</button
          >
        </div>
      </div>
      <div style="grid-template-columns: 40% 30%" class="row">
        <span>{t("ui.account.level")}</span>
        <div>
          <select
            id="level"
            name="level"
            class="select"
            bind:value={account.level}
            title={t("ui.account.level")}
            required
          >
            <option value={0}>{t("ui.account.userLevel")}</option>
            <option value={1}>{t("ui.account.adminLevel")}</option>
          </select>
        </div>
      </div>
      <div style="grid-template-columns: 40% 30%" class="row">
        <span>{t("ui.account.guild")}</span>
        <div>
          <select
            id="guild"
            name="guild"
            class="select"
            bind:value={account.guild}
            title={t("ui.account.guild")}
            required
          >
            <option value={-1}>{"None"}</option>
            {#each guilds as guild}
              <option
                style={`color: var(--faction-colour-${guild.faction});`}
                value={guild.id}>{guild.name}</option
              >
            {/each}
          </select>
        </div>
      </div>
      <div style="grid-template-columns: 40% 30%; height: 100%" class="row">
        <span>{t("ui.account.characters")}</span>
        <div>
          <MultiSelect
            id="characters"
            name="characters"
            style="width: 409px; 
            min-height: 34px; 
            background-color: var(--palette-secondary-main); 
            border: 1px solid black;
            font-weight: bold;
            font-size: medium; padding: 0;
            padding-left: 4px; 
            color: black;"
            ulOptionsStyle="background-color: var(--palette-secondary-dark); 
            font-weight: bold;
            font-size: medium; 
            color: black;"
            liSelectedStyle="background-color: var(--palette-primary-main);"
            bind:selected={accountCharacters}
            options={characters.map((character: Character) => ({
              label: character.name,
              value: character.id,
            }))}
          />
        </div>
      </div>
      <div style="grid-template-columns: 40% 30%;" class="row">
        <button class="button-base" type="submit" title={t("ui.options.submit")}
          >{t("ui.options.submit")}</button
        >
      </div>
    </div>
  </form>
{/await}

<style>
  option {
    background-color: var(--palette-secondary-dark);
    font-weight: bold;
  }
  option:checked {
    background-color: var(--palette-primary-dark);
  }
  .error {
    font-size: large;
    font-weight: bold;
    text-shadow: none;
    color: red;
  }
</style>

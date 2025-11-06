<script lang="ts">
  import {
    Faction,
    ICON_QUESTIONMARK,
    RealmVersion,
    Region,
  } from "$lib/consts";
  import { t } from "$lib/i18n/index.svelte";
  import type { Guild } from "$lib/types";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import IconButton from "@smui/icon-button";
  import { getContext } from "svelte";
  import WarcraftIcon from "../WarcraftIcon.svelte";

  let { guild, guilds, handleSubmit } = $props<{
    guild: Guild;
    guilds: Guild[];
    handleSubmit: (guild_data: Guild) => void;
  }>();
  let formData = $state(JSON.parse(JSON.stringify(guild)));
  let nameError: string | null = $state("");
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  const baseGuild: Guild = JSON.parse(JSON.stringify(guild)) as Guild;

  function handleNameInput(inputValue: string) {
    formData.name = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(formData.name, formData.realm);
  }

  function handleValidInput(event: InputEvent) {
    const input = event.data;
    if (
      input &&
      (!/^\p{L}+$/u.test(input) || /(.)\1\1/.test(`${formData.name}${input}`))
    ) {
      event.preventDefault();
    }
  }

  function handleRealmInput(inputValue: string) {
    formData.realm = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(formData.name, formData.realm);
  }

  function handleChangeFaction(event: Event) {
    event.stopPropagation();
    if (formData.faction === Faction.Alliance) {
      formData.faction = Faction.Horde;
    } else {
      formData.faction = Faction.Alliance;
    }
  }

  function checkDuplicate(name: string, realm: string) {
    nameError = guilds.some(
      (other_guild: Guild) =>
        other_guild.realm.trim().toLowerCase() ===
          realm?.trim().toLowerCase() &&
        other_guild.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        formData.region.trim().toLowerCase() ===
          other_guild.region.trim().toLowerCase() &&
        other_guild.version === formData.version
    )
      ? `"${name}" already exists on "${realm}".`
      : null;
  }

  function handleReset() {
    formData = JSON.parse(JSON.stringify(baseGuild));
    nameError = null;
  }
</script>

<div>
  <div
    style="display: flex; flex-direction: column; width: 100%; padding: 10px; gap: 5px;"
  >
    <div style="grid-template-columns: 40% 40%" class="row">
      <span>{t("ui.guilds.name")}</span>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Name"
        minlength="3"
        bind:value={formData.name}
        onbeforeinput={handleValidInput}
        oninput={() => handleNameInput(formData.name)}
        spellcheck="false"
        autocomplete="off"
        pattern="[A-Za-z\s]*"
        class="textinput"
        required
        title={t("ui.guilds.name")}
      />
    </div>
    {#if nameError}
      <div style="grid-template-columns: 100%" class="row">
        <p style="color: red;">{nameError}</p>
      </div>
    {/if}
    <div style="grid-template-columns: 40% 30%;" class="row">
      <span>{t("ui.guilds.realm")}</span>
      <div>
        <input
          id="realm"
          name="realm"
          type="text"
          placeholder="Realm"
          spellcheck="false"
          autocomplete="off"
          bind:value={formData.realm}
          onbeforeinput={handleValidInput}
          oninput={() => handleRealmInput(formData.realm)}
          class="textinput"
          required
          title={t("ui.guilds.realm")}
        />
      </div>
    </div>
    <div style="grid-template-columns: 40% 30%; align-content: center;" class="row">
      <span>{t("ui.guilds.faction")}</span>
      <IconButton
        type="button"
        aria-label={t(`ui.changeFaction`)}
        onclick={(e: Event) => handleChangeFaction(e)}
      >
        <WarcraftIcon
          src={gameVersionFactory.iconProvider.getFromSource(
            gameVersionFactory.gameVersion
              .getFactions()
              .find((_faction) => _faction.name === formData.faction)?.icon ??
              ICON_QUESTIONMARK
          )}
          label={t(`faction.${formData.faction}`)}
        />
      </IconButton>
    </div>

    {#if !["classic", "tbc"].includes(gameVersionFactory.gameVersion.getName())}
      <div style="grid-template-columns: 40% 30%" class="row">
        <span>{t("ui.guilds.achievementPoints")}</span>
        <div>
          <input
            id="achievement_points"
            name="achievement_points"
            type="number"
            class="textinput"
            bind:value={formData.achievement_points}
            placeholder="0"
            min="0"
            title={t("ui.guilds.achievementPoints")}
          />
        </div>
      </div>
    {/if}
    <div style="grid-template-columns: 40% 30%" class="row">
      <span>{t("ui.guilds.region")}</span>
      <div>
        <select
          onchange={() => checkDuplicate(formData.name, formData.realm)}
          id="region"
          name="region"
          class="select"
          bind:value={formData.region}
          required
          title={t("ui.guilds.region")}
        >
          {#each Object.values(Region) as region}
            <option value={region}>{t(`region.${region}`)}</option>
          {/each}
        </select>
      </div>
    </div>
    <div style="grid-template-columns: 40% 30%" class="row">
      <span>{t("ui.guilds.version")}</span>
      <div>
        <select
          onchange={() => checkDuplicate(formData.name, formData.realm)}
          id="version"
          name="version"
          class="select"
          bind:value={formData.version}
          required
          title={t("ui.guilds.version")}
        >
          {#each Object.values(GameVersionName) as version}
            <option value={version}>{t(`version.${version}`)}</option>
          {/each}
        </select>
      </div>
    </div>
    <div style="grid-template-columns: 40% 30%" class="row">
      <span>{t("ui.guilds.realmVersion")}</span>
      <div>
        <select
          id="realm_version"
          name="realm_version"
          class="select"
          bind:value={formData.realm_version}
          required
          title={t("ui.guilds.realmVersion")}
        >
          {#each Object.values(RealmVersion) as realm_version}
            <option value={realm_version}
              >{t(`realm_version.${realm_version}`)}</option
            >
          {/each}
        </select>
      </div>
    </div>
  </div>
  <button
    type="button"
    onclick={() => handleSubmit(formData)}
    class="button-save"
    disabled={nameError ||
    !formData.name ||
    !formData.realm ||
    formData.name === "" ||
    formData.realm === ""
      ? true
      : false}>{t("ui.save")}</button
  >
  <button type="button" class="button-base" onclick={() => handleReset()}
    >{t(`ui.reset`)}</button
  >
</div>

<style>
  option {
    background-color: var(--palette-secondary-dark);
    font-weight: bold;
  }
  option:checked {
    background-color: var(--palette-primary-dark);
  }
</style>

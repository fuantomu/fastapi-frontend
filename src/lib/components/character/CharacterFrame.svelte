<script lang="ts">
  import type { Character, Guild } from "$lib/types";
  import Paper, { Content } from "@smui/paper";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getContext } from "svelte";
  import { ICON_QUESTIONMARK } from "$lib/consts";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import CharacterChangeList from "./CharacterChangeList.svelte";
  import { PlayerSpec } from "$lib/versions/PlayerSpecialization";
  import { PlayerClass } from "$lib/versions/PlayerClass";

  const gameVersion = getContext<GameVersionName>("gameVersion");
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  const { character, character_guild, other_characters, guilds } = $props<{
    character: Character;
    character_guild: Guild;
    other_characters: Character[];
    guilds: Guild[];
  }>();

  let edit: Boolean = $state(false);
  let nameInput: string = $state(character.name);
  let realmInput: string = $state(character.realm);
  let selectedGuild: number = $state(character_guild.id);
  let selectedLevel: number = $state(character.level);
  let selectedAchievementPoints: number = $state(character.achievement_points);
  let selectedItemlevel: number = $state(character.equipped_item_level);

  let player_class = $state(
    gameVersionFactory.gameVersion
      .getClasses()
      .find((_class) => _class.name == character.character_class)
  );
  let player_spec =
    gameVersionFactory.gameVersion
      .getSpecs()
      .find(
        (_spec) =>
          _spec.name === `${character.character_class}${character.active_spec}`
      ) ??
    PlayerSpec.fromSource(
      { name: "Adventurer", class: "Adventurer", icon: ICON_QUESTIONMARK },
      [PlayerClass.fromSource({ name: "Adventurer", icon: ICON_QUESTIONMARK })]
    );
  const player_race = gameVersionFactory.gameVersion
    .getRaces()
    .find((_race) => _race.name == character.race);
  const player_faction = gameVersionFactory.gameVersion
    .getFactions()
    .find((_faction) => _faction.name == character.faction);

  function handleEdit() {
    edit = !edit;
    handleReset();
  }
  function handleNameInput(inputValue: string) {
    nameInput = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    if (nameInput.length == 0) {
      nameError = t("error.empty", { var: "Name" });
    } else {
      checkDuplicate(nameInput, realmInput);
    }
  }

  function handleRealmInput(inputValue: string) {
    realmInput = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(nameInput, realmInput);
  }

  function handleReset() {
    nameInput = character.name;
    realmInput = character.realm;
    selectedAchievementPoints = character.achievement_points;
    selectedGuild = character_guild.id;
    selectedItemlevel = character.equipped_item_level;
    selectedLevel = character.level;
    nameError = null;
  }

  let nameError: string | null = $state(null);
  let realmError: string | null = $state(null);
  function checkDuplicate(name: string, realm: string) {
    realmError = realm.length == 0 ? t("error.empty", { var: "Realm" }) : null;
    nameError = name.length == 0 ? t("error.empty", { var: "Name" }) : null;
    if (!nameError && !realmError) {
      nameError = realmError = other_characters.some(
        (character: Character) =>
          character.realm.trim().toLowerCase() === realm.trim().toLowerCase() &&
          character.name.trim().toLowerCase() === name.trim().toLowerCase()
      )
        ? t(`error.duplicateCharacter`, {
            name: name,
            realm: realm,
          })
        : null;
    }
  }

  let spec_raceError: boolean = $state(
    player_class?.name === "Adventurer" || player_spec.name === "Adventurer"
      ? true
      : false
  );
</script>

<Paper style={"border: 1px solid black"}>
  <Content>
    {#if edit}
      <form method="POST">
        <input id="id" type="hidden" name="id" value={character.id} />
        <input
          id="gameVersion"
          type="hidden"
          name="gameVersion"
          value={gameVersion}
        />
        <div class="player-grid">
          <div class="icons">
            <CharacterChangeList
              currentClass={player_class ?? character.class}
              currentRace={player_race ?? character.race}
              currentSpec={player_spec ?? character.spec}
              gender={character.gender}
              bind:error={spec_raceError}
            ></CharacterChangeList>
          </div>

          <div class="character-details">
            <div class="name-line">
              <span
                class="name"
                style={`color: var(--player-class-colour-${character.character_class})`}
              >
                <input
                  id="name"
                  type="text"
                  name="name"
                  class={`input ${nameError ? "input-error" : ""}`}
                  bind:value={nameInput}
                  oninput={() => handleNameInput(nameInput)}
                  placeholder="Name"
                  title={nameError ? nameError : "Name"}
                  required
                />
                <input
                  id="realm"
                  type="text"
                  name="realm"
                  class={`input ${realmError ? "input-error" : ""}`}
                  bind:value={realmInput}
                  oninput={() => handleRealmInput(realmInput)}
                  placeholder="Realm"
                  title={realmError ? realmError : "Realm"}
                  required
                />
              </span>
              <select
                id="guild"
                name="guild"
                class="input"
                bind:value={selectedGuild}
                title={t("ui.guild")}
                required
              >
                <option value={-1}>{"None"}</option>
                {#each guilds as guild}
                  <option
                    style={`color: var(--faction-colour-${guild.faction})`}
                    value={guild.id}>{guild.name}</option
                  >
                {/each}
              </select>
            </div>
            {#if nameError || realmError}
              <p style="color: red;">{nameError || realmError}</p>
            {/if}
            <div class="class-line">
              <span class="class-spec">
                <input
                  id="level"
                  name="level"
                  type="number"
                  class="input"
                  bind:value={selectedLevel}
                  placeholder="0"
                  title="Level"
                />
              </span>

              <input
                id="equipped_item_level"
                name="equipped_item_level"
                type="number"
                class="input"
                bind:value={selectedItemlevel}
                placeholder="0"
                title={t("ui.itemlevel")}
              />
              <input
                id="achievement_points"
                name="achievement_points"
                type="number"
                class="input"
                bind:value={selectedAchievementPoints}
                placeholder="0"
                title={t("ui.achievement_points")}
              />
            </div>
            <div class="last-login">
              {t("character.activity")}: {new Date(
                character.last_login_timestamp
              ).toLocaleString("en-GB", {
                dateStyle: "long",
                timeStyle: "medium",
              })}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={nameError || spec_raceError || realmError ? true : false}
          >{t(`ui.save`)}</button
        >
      </form>
    {:else}
      <div class="player-grid">
        <div class="icons">
          <WarcraftIcon
            label={t(`faction.${character.faction}`)}
            src={gameVersionFactory.iconProvider.getFromSource(
              player_faction?.icon ?? ICON_QUESTIONMARK
            )}
          />
          <WarcraftIcon
            label={t(`race.${character.gender}.${character.race}`)}
            src={gameVersionFactory.iconProvider.getFromSource(
              (character.gender == "Female"
                ? player_race?.icon_female
                : player_race?.icon_male) ?? ICON_QUESTIONMARK
            )}
          />
          <WarcraftIcon
            label={t(
              player_spec?.name
                ? `specs.${player_spec?.name}`
                : `classes.${character.character_class}`
            )}
            src={gameVersionFactory.iconProvider.getFromSource(
              player_spec?.icon ?? player_class?.icon ?? ICON_QUESTIONMARK
            )}
          />
        </div>
        <div class="character-details">
          <div class="name-line">
            <span
              class="name"
              style={`color: var(--player-class-colour-${character.character_class})`}
            >
              {character.name}
              <span class="realm">{character.realm}</span>
            </span>

            <a
              class="guild"
              href={`/${gameVersion}/guilds/${character_guild.id}`}
              style={`color: var(--faction-colour-${character_guild.faction})`}
            >
              {character_guild.name}
            </a>
          </div>
          <div class="class-line">
            <span class="class-spec">
              {character.level}
              {t(`specs.${character.character_class}${character.active_spec}`)}
              {t(`classes.${character.character_class}`)}
            </span>

            <span class="ilvl">{character.equipped_item_level} ILVL</span>

            <span class="achievement">
              <img
                alt={t("ui.achievement")}
                src="/image/achievement_shield_icon.png"
              />
              <span>{character.achievement_points}</span>
            </span>
          </div>

          <div class="last-login">
            {t("character.activity")}: {new Date(
              character.last_login_timestamp
            ).toLocaleString("en-GB", {
              dateStyle: "long",
              timeStyle: "medium",
            })}
          </div>
        </div>
      </div>
    {/if}
    {#if edit}
      <button type="reset" onclick={() => handleReset()}>{t(`ui.reset`)}</button
      >
    {/if}
    <button type="button" onclick={() => handleEdit()}
      >{t(edit ? `ui.cancel` : `ui.edit`)}</button
    >
  </Content>
</Paper>

<style>
  .player-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "icons character-details ilvl"
      "icons guild achievement";
    gap: 0px 16px;
    align-items: start;
    background-color: #1c1c1c;
  }

  .icons {
    grid-area: icons;
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
  }

  .character-details {
    grid-area: character-details;
    display: flex;
    flex-direction: column;
  }

  .name-line {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .name {
    font-weight: bold;
    font-size: 1.2em;
  }

  .realm {
    font-size: 0.7em;
    font-weight: lighter;
    color: aliceblue;
  }

  .guild {
    font-weight: bold;
    font-size: 1.2em;
    text-decoration: none;
  }

  .class-spec {
    font-size: 0.9em;
    color: #ccc;
  }

  .ilvl {
    grid-area: ilvl;
    color: var(--ui-colour-system);
    font-weight: normal;
    justify-self: end;
  }

  .achievement {
    grid-area: achievement;
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--ui-colour-system);
    font-size: 0.9em;
  }

  .last-login {
    font-size: 0.85em;
    color: #888;
  }

  .input {
    border: 1px solid black;
    background: var(--palette-secondary-dark);
    color: var(--palette-text-primary);
    font-weight: inherit;
    font-size: inherit;
  }

  .input-error {
    border: 1px solid red;
  }

  .option:hover {
    color: #eee;
  }
</style>

<script lang="ts">
  import type { Character, Guild } from "$lib/types";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getContext } from "svelte";
  import { ICON_QUESTIONMARK } from "$lib/consts";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { PlayerSpec } from "$lib/versions/PlayerSpecialization";
  import { PlayerClass } from "$lib/versions/PlayerClass";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  let { character, character_guild } = $props<{
    character: Character;
    character_guild: Guild;
  }>();

  let character_spec =
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
  let character_race = gameVersionFactory.gameVersion
    .getRaces()
    .find((_race) => _race.name == character.race);
  let character_faction = gameVersionFactory.gameVersion
    .getFactions()
    .find((_faction) => _faction.name == character.faction);
</script>

<div>
  <div class="player-grid">
    <div class="icons">
      <WarcraftIcon
        label={t(`faction.${character.faction}`)}
        src={gameVersionFactory.iconProvider.getFromSource(
          character_faction?.icon ?? ICON_QUESTIONMARK
        )}
      />
      <WarcraftIcon
        label={t(`race.${character.gender}.${character.race}`)}
        src={gameVersionFactory.iconProvider.getFromSource(
          (character.gender == "Female"
            ? character_race?.icon_female
            : character_race?.icon_male) ?? ICON_QUESTIONMARK
        )}
      />
      <WarcraftIcon
        label={t(
          character.active_spec
            ? `specs.${character.active_spec}`
            : `classes.${character.character_class}`
        )}
        src={gameVersionFactory.iconProvider.getFromSource(
          character_spec?.icon ?? character_spec?.icon ?? ICON_QUESTIONMARK
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
          <span class="realm"
            >{character.realm}-{character.region?.toUpperCase()}</span
          >
        </span>

        <a
          class="guild"
          href={`/${gameVersionFactory.gameVersion.getName()}/guilds/${character_guild.id}`}
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

        {#if !["classic", "tbc"].includes(gameVersionFactory.gameVersion.getName())}
          <span class="achievement">
            <img
              alt={t("ui.achievement")}
              src="/image/achievement_shield_icon.png"
            />
            <span>{character.achievement_points}</span>
          </span>
        {/if}
      </div>

      <div class="last-login">
        <img
          style="width: 16px; height: 16px; align-self: center"
          src="/image/icon_online.png"
          alt={t("character.activity")}
        />
        {t("character.activity")}: {new Date(
          character.last_login_timestamp
        ).toLocaleString("en-GB", {
          dateStyle: "long",
          timeStyle: "medium",
        })}
      </div>
    </div>
  </div>
</div>

<style>
  .player-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "icons character-details ilvl"
      "icons guild achievement";
    gap: 0px 16px;
    align-items: start;
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
    display: flex;
  }
</style>

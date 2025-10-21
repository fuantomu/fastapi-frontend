<script lang="ts">
  import type { Character, Guild, WCLRanking, WCLZone } from "$lib/types";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { getContext } from "svelte";
  import { ICON_QUESTIONMARK } from "$lib/consts";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { PlayerSpec } from "$lib/versions/PlayerSpecialization";
  import { PlayerClass } from "$lib/versions/PlayerClass";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { getRankColor } from "$lib/helper/wcl";

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

  let ranking: WCLRanking = $state({} as WCLRanking);
  let zone: WCLZone = $state({} as WCLZone)

  async function fetchRanking() {
    const res = await fetch(
      `${PUBLIC_API_URL}/Warcraftlogs/Ranking/?character=${character.name}&server=${character.realm}&region=${character.region}&wcl_version=${character.realm_version}`
    );
    const data = await res.json();
    if (data.Result){
      ranking = data.Result;
    }
  }

  async function fetchZone() {
    const zone_res = await fetch(
        `${PUBLIC_API_URL}/Warcraftlogs/Zone/?zone=${ranking.zoneRankings.zone}&wcl_version=${character.realm_version}`
      );
      const zone_data = await zone_res.json();
      if(zone_data) {
        zone = zone_data.Result
      }
  }

  let fetchData = async () => {
      await fetchRanking();
      await fetchZone();
  };
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
          {#if character.active_title}
            {character.active_title.replace("%s", character.name)}
          {:else}
            {character.name}
          {/if}

          <span class="realm"
            >{character.realm}-{character.region?.toUpperCase()}</span
          >
        </span>

        <div>
          <a
            class="guild"
            href={`/${gameVersionFactory.gameVersion.getName()}/guilds/${character_guild.id}`}
            style={`color: var(--faction-colour-${character_guild.faction})`}
          >
            {character_guild.name}
          </a>
        </div>
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
  <div
    style="display: flex; align-items: end; height: 300px"
  >
    <div style="display: flex; justify-content: end; align-items: center; border: 1px solid black; padding: 20px">
      <a
        href="https://{character.realm_version}.warcraftlogs.com/character/{character.region.toLowerCase()}/{character.realm
          .toLowerCase()
          .replace(' ', '-')}/{character.name.toLowerCase()}"
      >
        <img
          style="height: 32px; width: 32px"
          src="/image/external/wcl.png"
          alt="Warcraftlogs"
        />
      </a>
      {#await fetchData() then}
        <div
          style="display: flex; flex-direction: column; margin-left: 20px; font-size: 0.9em;"
        >
        <div
            style="display: flex; align-content: center; justify-content: center; gap: 20px"
          >
            <span>{zone.name} - {ranking.zoneRankings.size} {zone.difficulties.find((difficulty) => difficulty.id === ranking.zoneRankings.difficulty)?.name}</span>
          </div>
          <div style="display: flex; flex-direction: row; gap: 10px; ">
            <div
              style="display: flex; flex-direction: column; align-items: center;"
            >
              <span>{t(`ui.bestPerformance`)}</span>
              <span
                style="color: var(--ui-colour-wcl-{getRankColor(
                  ranking.zoneRankings.bestPerformanceAverage ?? 0
                )});"
                >{ranking.zoneRankings.bestPerformanceAverage?.toPrecision(
                  4
                )}</span
              >
            </div>
            <div
              style="display: flex; flex-direction: column; align-items: center"
            >
              <span>{t(`ui.medianPerformance`)}</span>
              <span
                style="color: var(--ui-colour-wcl-{getRankColor(
                  ranking.zoneRankings.medianPerformanceAverage ?? 0
                )});"
                >{ranking.zoneRankings.medianPerformanceAverage?.toPrecision(
                  4
                )}</span
              >
            </div>
            <div
              style="display: flex; flex-direction: column; align-items: center"
            >
              <span>{t(`ui.globalRank`)}</span>
              <span
                style="color: var(--ui-colour-wcl-{getRankColor(
                  (1 -
                    ranking.zoneRankings.allStars[0].rank /
                      ranking.zoneRankings.allStars[0].total) *
                    100
                )});">{ranking.zoneRankings.allStars[0].rank}</span
              >
            </div>
            <div
              style="display: flex; flex-direction: column; align-items: center"
            >
              <span>{t(`ui.serverRank`)}</span>
              <span
                style="color: var(--ui-colour-wcl-{getRankColor(
                  (1 -
                    ranking.zoneRankings.allStars[0].serverRank /
                      ranking.zoneRankings.allStars[0].total) *
                    100
                )});">{ranking.zoneRankings.allStars[0].serverRank}</span
              >
            </div>
          </div>
          <div
            style="display: flex; align-content: center; justify-content: center; gap: 20px"
          >
            <span>{t(`ui.allStarPoints`)}</span>
            <span>{ranking.zoneRankings.allStars[0].points}</span>
          </div>
        </div>
      {/await}
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
    align-content: center;
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

<script lang="ts">
  import { t } from "$lib/i18n/index.svelte";
  import type {
    Guild,
    RosterCharacter
  } from "$lib/types";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { getContext } from "svelte";

  let { guild, guild_master } = $props<{
    guild: Guild;
    guild_master: RosterCharacter;
  }>();
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
</script>

<div style="margin: 40px; display: flex;">
  <div class="player-grid">
    <div class="character-details">
      <div class="name-line">
        <span
          class="name"
          style={`color: var(--faction-colour-${guild.faction})`}
        >
          {guild.name}

          <span class="realm">{guild.realm}-{guild.region?.toUpperCase()}</span>
        </span>
      </div>
      <div>
        {#if !["classic", "tbc"].includes(gameVersionFactory.gameVersion.getName())}
          <span class="achievement">
            <img
              alt={t("ui.achievement")}
              src="/image/achievement_shield_icon.png"
            />
            <span>{guild.achievement_points}</span>
          </span>
        {/if}
        <div class="guild-master">
          <img
            style="width: 16px; height: 16px; align-self: center"
            src="/image/ui/icon_leader.png"
            alt={t("ui.guilds.master")}
          />
          {t("ui.guilds.master")}: {guild_master.name}
        </div>
      </div>
      <div class="created-date">
        {t("ui.guilds.created")}: {new Date(
          guild.created_timestamp
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
      "character-details"
      "achievement";
    gap: 0px 16px;
    align-items: start;
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
  .achievement {
    grid-area: achievement;
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--ui-colour-system);
    font-size: 0.9em;
  }
  .guild-master {
    grid-area: achievement;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .created-date {
    font-size: 0.85em;
    color: #888;
    display: flex;
  }
</style>

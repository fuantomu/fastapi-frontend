<script lang="ts">
  import { goto } from "$app/navigation";
  import type {
    Character,
    CharacterEquipment,
    CharacterSpec,
    CharacterStatistic,
    Guild,
  } from "$lib/types";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { getContext } from "svelte";
  import CharacterFrame from "./CharacterFrame.svelte";
  import Paper, { Content } from "@smui/paper";
  import EquipmentFrame from "./EquipmentFrame.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { t } from "$lib/i18n/index.svelte";
  import StatisticFrame from "./StatisticFrame.svelte";
  import GlyphFrame from "$lib/components/character/GlyphFrame.svelte";
  import TalentFrame from "$lib/components/character/TalentFrame.svelte";

  const { id } = $props<{ id: number }>();

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  let character: Character = $state({} as Character);
  let other_characters: Character[] = $state([]);
  let guilds: Guild[] = $state([]);
  let character_equipment: CharacterEquipment = $state(
    {} as CharacterEquipment
  );
  let character_guild: Guild = $state({} as Guild);
  let active_spec: CharacterSpec = $state({} as CharacterSpec);
  let off_spec: CharacterSpec = $state({} as CharacterSpec);
  let character_statistics: CharacterStatistic = $state(
    {} as CharacterStatistic
  );

  const fetchCharacter = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/?id=${id}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    if (data.Result.length == 0) {
      window.location.href = `/${gameVersionFactory.gameVersion.getName()}/characters`;
    }
    character = data.Result[0];
  };

  const fetchOtherCharacters = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/?version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    other_characters = data.Result.filter(
      (other_character: Character) => character?.name !== other_character.name
    );
  };

  const fetchGuilds = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Guild/?version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    guilds = data.Result.filter(
      (guild: Guild) =>
        guild.version === gameVersionFactory.gameVersion.getName()
    );
    character_guild =
      guilds.find((guild: Guild) => guild.id === character?.guild) ??
      ({} as Guild);
  };

  const fetchEquipment = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/Equipment/?id=${id}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    character_equipment = data.Result;
  };

  const fetchSpecialization = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/Specialization/?id=${id}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    let character_specializations = data.Result;
    active_spec =
      character_specializations?.find((spec: CharacterSpec) => spec.active) ??
      ({} as CharacterSpec);
    off_spec =
      character_specializations?.find((spec: CharacterSpec) => !spec.active) ??
      ({} as CharacterSpec);
  };

  const fetchStatistic = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/Statistic/?id=${id}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    character_statistics = data.Result;
  };

  let fetchData = async () => {
    await fetchCharacter();
    await fetchGuilds();
    await fetchOtherCharacters();
    await fetchEquipment();
    await fetchSpecialization();
    await fetchStatistic();
  };

  let equipment_updated: string | null = $state(null);

  function handleGoBack() {
    goto(`/${gameVersionFactory.gameVersion.getName()}/characters`);
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }

  async function handleRefresh() {
    equipment_updated = t("ui.updatingCharacter");

    let response = await fetch(`${PUBLIC_API_URL}/Character/Parse/`, {
      method: "POST",
      body: JSON.stringify({
        players: [[character?.name, character?.realm]],
        region: character.region,
        version: gameVersionFactory.gameVersion.getName(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data["Result"] === "Not Found") {
        equipment_updated = t("ui.characterNotFound");
        return;
      }
      await fetchData();
      equipment_updated = null;
      goto(
        `/${gameVersionFactory.gameVersion.getName()}/characters/${data["Result"]}`
      );
    } else {
      equipment_updated = t("ui.errorFetchingData");
    }
  }
</script>

<div>
  {#await fetchData()}
    <p>Loading...</p>
  {:then}
    {#if character}
      {#if equipment_updated}
        <p style="color: yellow;">{equipment_updated}</p>
      {/if}
      <Paper
        style={"border: 1px solid black; display: grid; grid-template-columns: 25% 35% 40%"}
      >
        <Content>
          <CharacterFrame
            {character}
            {character_guild}
            {other_characters}
            {guilds}
          />
        </Content>
        <Content>
          <EquipmentFrame equipment={character_equipment} />
        </Content>
        <Content>
          <StatisticFrame statistics={character_statistics} />
        </Content>
      </Paper>
      {#if active_spec.name}
        <Paper
          style={["wotlk", "cataclysm", "mop"].includes(
            gameVersionFactory.gameVersion.getName()
          )
            ? "border: 1px solid black; display: grid; grid-template-columns: 50% 50%;"
            : "border: 1px solid black; display: grid;"}
        >
          <Content>
            <TalentFrame
              specialization={active_spec}
              character_class={character.character_class}
              level={character.level}
              active={true}
            />
          </Content>
          {#if ["wotlk", "cataclysm", "mop"].includes(gameVersionFactory.gameVersion.getName())}
            <Content>
              <GlyphFrame glyphs={active_spec.glyphs} />
            </Content>
          {/if}
        </Paper>
      {/if}
      {#if off_spec.name}
        <Paper
          style={["wotlk", "cataclysm", "mop"].includes(
            gameVersionFactory.gameVersion.getName()
          )
            ? "border: 1px solid black; display: grid; grid-template-columns: 50% 50%;"
            : "border: 1px solid black; display: grid; "}
        >
          <Content>
            <TalentFrame
              specialization={off_spec}
              character_class={character.character_class}
              level={character.level}
              active={false}
            />
          </Content>
          {#if ["wotlk", "cataclysm", "mop"].includes(gameVersionFactory.gameVersion.getName())}
            <Content>
              <GlyphFrame glyphs={off_spec.glyphs} />
            </Content>
          {/if}
        </Paper>
      {/if}
      <br />
      <button
        disabled={equipment_updated ? true : false}
        onclick={() => handleRefresh()}>Refresh</button
      >
      <button onclick={() => handleDelete()}>Delete Character </button>
    {/if}

    <br />
    <button onclick={() => handleGoBack()}> Go back </button>
  {/await}
</div>

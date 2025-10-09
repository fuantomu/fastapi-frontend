<script lang="ts">
  import { goto } from "$app/navigation";
  import type {
    Character,
    CharacterEquipment,
    CharacterSpec,
    Guild,
  } from "$lib/types";
  import { PUBLIC_API_URL } from "$env/static/public";
  import TalentFrame from "$lib/components/TalentFrame.svelte";
  import GlyphFrame from "$lib/components/GlyphFrame.svelte";
  import { getContext } from "svelte";
  import CharacterFrame from "./CharacterFrame.svelte";
  import Paper, { Content } from "@smui/paper";
  import EquipmentFrame from "./EquipmentFrame.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";

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

  const fetchCharacter = async () => {
    const res = await fetch(`${PUBLIC_API_URL}/Character/?id=${id}`);
    const data = await res.json();
    if (data.Result.length == 0){
      window.location.href = `/${gameVersionFactory.gameVersion.getName()}/characters`
    }
    character = data.Result[0];
  };

  const fetchOtherCharacters = async () => {
    const res = await fetch(`${PUBLIC_API_URL}/Character/`);
    const data = await res.json();
    other_characters = data.Result.filter(
      (other_character: Character) => character?.name !== other_character.name
    );
  };

  const fetchGuilds = async () => {
    const res = await fetch(`${PUBLIC_API_URL}/Guild/`);
    const data = await res.json();
    guilds = data.Result;
    character_guild =
      guilds.find((guild) => guild.id === character?.guild) ?? ({} as Guild);
  };

  const fetchEquipment = async () => {
    const res = await fetch(`${PUBLIC_API_URL}/Character/Equipment/?id=${id}`);
    const data = await res.json();
    character_equipment = data.Result;
  };

  const fetchSpecialization = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/Specialization/?id=${id}`
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

  let fetchData = async () => {
    await fetchCharacter();
    await fetchGuilds();
    await fetchOtherCharacters();
    await fetchEquipment();
    await fetchSpecialization();
  };

  let equipment_updated: string | null = $state(null);

  function handleGoBack() {
    goto(`/${gameVersionFactory.gameVersion.getName()}/characters`);
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }

  async function handleRefresh() {
    equipment_updated = "Updating Character...";

    let response = await fetch(`${PUBLIC_API_URL}/Character/Parse/`, {
      method: "POST",
      body: JSON.stringify({
        players: [[character?.name, character?.realm]],
        region: character.region,
        version: gameVersionFactory.gameVersion.getName()
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data["Result"] === "Success") {
        await fetchData();
        equipment_updated = null;
      } else {
        equipment_updated = data["Result"];
      }
    } else {
      equipment_updated = "Error fetching data";
    }
  }
</script>

<div>
  {#await fetchData()}
    <p>Loading...</p>
  {:then}
    {#if character}
      <h2>Show</h2>
      {#if equipment_updated}
        <p style="color: yellow;">{equipment_updated}</p>
      {/if}
      <Paper
        style={"border: 1px solid black; display: grid; grid-template-columns: 20% 35%;"}
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
      </Paper>
      {#if active_spec}
        <br />
        Active Spec {active_spec.name} {["classic","tbc","wotlk"].includes(gameVersionFactory.gameVersion.getName())? active_spec.spent_points : ""}
        <br />
        {#each active_spec?.talents as talent}
          <TalentFrame {talent}></TalentFrame>
        {/each}
        <br />
        {#each active_spec?.glyphs as glyph}
          <GlyphFrame {glyph}></GlyphFrame>
        {/each}
      {/if}
      {#if off_spec}
        <br />
        Off Spec {off_spec.name} {["classic","tbc","wotlk"].includes(gameVersionFactory.gameVersion.getName())? off_spec.spent_points : ""}
        <br />
        {#each off_spec?.talents as talent}
          <TalentFrame {talent}></TalentFrame>
        {/each}
        <br />
        {#each off_spec?.glyphs as glyph}
          <GlyphFrame {glyph}></GlyphFrame>
        {/each}
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

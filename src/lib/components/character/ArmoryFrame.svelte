<script lang="ts">
  import { goto } from "$app/navigation";
  import type {
    Character,
    CharacterEquipment,
    CharacterSpec,
    Guild,
  } from "$lib/types";
  import { Faction, Gender, PlayerClass, PlayerSpec, Race } from "$lib/consts";
  import ItemFrame from "$lib/components/ItemFrame.svelte";
  import { PUBLIC_API_URL } from "$env/static/public";
  import TalentFrame from "$lib/components/TalentFrame.svelte";
  import GlyphFrame from "$lib/components/GlyphFrame.svelte";
  import { getContext } from "svelte";
  import type { GameVersionName } from "$lib/versions/GameVersion";

  const { id } = $props<{ id: number }>();

  const gameVersion = getContext<GameVersionName>("gameVersion");
  let character: Character = $state({} as Character);
  let other_characters: Character[] = $state([]);
  let guilds: Guild[] = $state([]);
  let character_equipment: CharacterEquipment = $state(
    {} as CharacterEquipment
  );
  let current_character_class: string = $state("");
  let character_guild: Guild = $state({} as Guild);
  let current_character_spec: string = $state("");
  let nameInput: string = $state("");
  let realmInput: string = $state("");
  let active_spec: CharacterSpec = $state({} as CharacterSpec);
  let off_spec: CharacterSpec = $state({} as CharacterSpec);

  const fetchCharacter = async () => {
    const res = await fetch(`${PUBLIC_API_URL}/Character/?id=${id}`);
    const data = await res.json();
    character = data.Result[0];
    current_character_class = character?.character_class ?? "Adventurer";
    current_character_spec = character?.active_spec ?? "Adventurer";
    nameInput = character?.name ?? "";
    realmInput = character?.realm ?? "";
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

  let edit: Boolean = $state(false);
  let equipment_updated: string | null = $state(null);

  function handleGoBack() {
    goto(`/${gameVersion}/characters`);
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }
  function handleEdit() {
    edit = !edit;
  }

  async function handleRefresh() {
    equipment_updated = "Updating Character...";

    let response = await fetch(`${PUBLIC_API_URL}/Character/Parse/`, {
      method: "POST",
      body: JSON.stringify({
        players: [[character?.name, character?.realm]],
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

  function handleNameInput(inputValue: string) {
    nameInput = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(nameInput, realmInput);
  }

  function handleRealmInput(inputValue: string) {
    realmInput = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(nameInput, realmInput);
  }

  let nameError: string | null = $state(null);
  function checkDuplicate(name: string, realm: string) {
    nameError = other_characters.some(
      (character) =>
        character.realm.trim().toLowerCase() === realm.trim().toLowerCase() &&
        character.name.trim().toLowerCase() === name.trim().toLowerCase()
    )
      ? `"${name}" already exists on "${realm}".`
      : null;
  }

</script>

<div>
  {#await fetchData()}
    <p>Loading...</p>
  {:then}
    {#if character}
      {#if edit}
        <h2>Edit</h2>
        <form {onsubmit} method="POST">
          <input id="id" type="hidden" name="id" value={character.id} />
          <input
            id="name"
            type="text"
            name="name"
            bind:value={nameInput}
            oninput={() => handleNameInput(nameInput)}
            required
          />
          {#if nameError}
            <p style="color: red;">{nameError}</p>
          {/if}
          <input
            id="realm"
            name="realm"
            type="text"
            bind:value={realmInput}
            oninput={() => handleRealmInput(realmInput)}
            placeholder="Realm"
            required
          />
          <select
            id="gender"
            name="gender"
            bind:value={character.gender}
            required
          >
            {#each Object.values(Gender) as gender}
              <option value={gender}>{gender}</option>
            {/each}
          </select>
          <select id="race" name="race" bind:value={character.race} required>
            {#each Object.values(Race) as race}
              <option value={race}>{race}</option>
            {/each}
          </select>
          <input
            id="level"
            name="level"
            type="number"
            value={character.level}
            placeholder="0"
          />
          <select
            id="guild"
            name="guild"
            bind:value={character_guild.id}
            required
          >
            <option value={"None"}>{"None"}</option>
            {#each guilds as guild}
              <option value={guild.id}>{guild.name}</option>
            {/each}
          </select>
          <select
            id="faction"
            name="faction"
            bind:value={character.faction}
            required
          >
            {#each Object.values(Faction) as faction}
              <option value={faction}>{faction}</option>
            {/each}
          </select>
          <select
            id="character_class"
            name="character_class"
            bind:value={current_character_class}
            required
          >
            {#each Object.values(PlayerClass) as character_class}
              <option value={character_class}>{character_class}</option>
            {/each}
          </select>
          <select
            id="active_spec"
            name="active_spec"
            bind:value={current_character_spec}
            required
          >
            {#each Object.entries(PlayerSpec).filter( (entry) => entry[0].includes(current_character_class) ) as active_spec}
              <option value={active_spec[1]}>{active_spec[1]}</option>
            {/each}
          </select>
          <input
            id="achievement_points"
            name="achievement_points"
            type="number"
            value={character.achievement_points}
            placeholder="0"
          />
          <input
            id="average_item_level"
            name="average_item_level"
            type="number"
            value={character.average_item_level}
            placeholder="0"
          />
          <input
            id="equipped_item_level"
            name="equipped_item_level"
            type="number"
            value={character.equipped_item_level}
            placeholder="0"
          />
          <input
            id="last_login_timestamp"
            name="last_login_timestamp"
            type="datetime"
            value={new Date(character.last_login_timestamp).toISOString()}
            placeholder={new Date().toISOString()}
          />
          <button type="submit" disabled={nameError ? true : false}>Save</button
          >
          <button type="reset" onclick={() => handleEdit()}>Cancel</button>
        </form>
      {:else}
        <h2>Show</h2>
        {#if equipment_updated}
          <p style="color: yellow;">{equipment_updated}</p>
        {/if}
        {character.name}
        {character.realm}
        {character.gender}
        {character.race}
        {character.level}
        {character_guild["name"]}
        {character.faction}
        {character.character_class}
        {character.active_spec}
        {character.achievement_points}
        {character.average_item_level}
        {character.equipped_item_level}
        {new Date(character.last_login_timestamp).toISOString()}
        {#if active_spec}
          <br />
          Active Spec {active_spec.name}
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
          Off Spec {off_spec.name}
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
        <ItemFrame equipment={character_equipment.head}></ItemFrame>
        <ItemFrame equipment={character_equipment.neck}></ItemFrame>
        <ItemFrame equipment={character_equipment.shoulders}></ItemFrame>
        <ItemFrame equipment={character_equipment.back}></ItemFrame>
        <ItemFrame equipment={character_equipment.chest}></ItemFrame>
        <ItemFrame equipment={character_equipment.shirt}></ItemFrame>
        <ItemFrame equipment={character_equipment.tabard}></ItemFrame>
        <ItemFrame equipment={character_equipment.wrist}></ItemFrame>
        <ItemFrame equipment={character_equipment.hands}></ItemFrame>
        <ItemFrame equipment={character_equipment.waist}></ItemFrame>
        <ItemFrame equipment={character_equipment.legs}></ItemFrame>
        <ItemFrame equipment={character_equipment.feet}></ItemFrame>
        <ItemFrame equipment={character_equipment.ring_1}></ItemFrame>
        <ItemFrame equipment={character_equipment.ring_2}></ItemFrame>
        <ItemFrame equipment={character_equipment.trinket_1}></ItemFrame>
        <ItemFrame equipment={character_equipment.trinket_2}></ItemFrame>
        <ItemFrame equipment={character_equipment.main_hand}></ItemFrame>
        <ItemFrame equipment={character_equipment.off_hand}></ItemFrame>
        <ItemFrame equipment={character_equipment.ranged}></ItemFrame>
        <button onclick={() => handleEdit()}>Edit</button>
        <button
          disabled={equipment_updated ? true : false}
          onclick={() => handleRefresh()}>Refresh</button
        >
        <button onclick={() => handleDelete()}>Delete Character </button>
      {/if}
    {:else}
      <p>Loading</p>
    {/if}

    <br />
    <button onclick={() => handleGoBack()}> Go back </button>
  {/await}
</div>

<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import type { Character, CharacterSpec, Guild } from "$lib/types";
  import { Faction, Gender, PlayerClass, PlayerSpec, Race } from "$lib/consts";
  import ItemFrame from "$lib/components/ItemFrame.svelte";
  import { PUBLIC_API_URL } from "$env/static/public";
  import TalentFrame from "$lib/components/TalentFrame.svelte";
  import GlyphFrame from "$lib/components/GlyphFrame.svelte";

  const id = page.url.pathname;
  let { data }: PageProps = $props();
  let character: Character | null = $state(data.item ?? null);
  let edit: Boolean = $state(false);
  let guilds: Guild[] = $state(data.guilds ?? []);
  let character_guild = $state(
    data.guilds?.find((guild) => guild.id === character?.guild) ?? {
      name: "Unknown",
      id: 0,
    }
  );
  let current_character_class = $state(
    character?.character_class ?? "Adventurer"
  );
  let current_character_spec = $state(character?.active_spec ?? "Adventurer");
  let equipment_updated = $state(false);
  let characters: Character[] = $state(data.characters ?? []);
  let nameInput: string = $state(character?.name ?? "");
  let realmInput: string = $state(character?.realm ?? "");
  let specializations: CharacterSpec[] = data.specializiation ?? [];
  let active_spec = specializations.find((spec: CharacterSpec) => spec.active);
  let off_spec = specializations.find((spec: CharacterSpec) => !spec.active);

  function handleGoBack() {
    goto("/characters");
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }
  function handleEdit() {
    edit = !edit;
  }

  async function handleRefresh() {
    let response = await fetch(`${PUBLIC_API_URL}/Character/Parse/`, {
      method: "POST",
      body: JSON.stringify({ players: [[character?.name, character?.realm]] }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      equipment_updated = true;
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
    nameError = characters.some(
      (character) =>
        character.realm.trim().toLowerCase() === realm.trim().toLowerCase() &&
        character.name.trim().toLowerCase() === name.trim().toLowerCase()
    )
      ? `"${name}" already exists on "${realm}".`
      : null;
  }
</script>

<h1>Test</h1>
{#if character}
  {#if edit}
    <h2>Edit</h2>
    <form method="POST">
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
      <select id="gender" name="gender" bind:value={character.gender} required>
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
      <select id="guild" name="guild" bind:value={character_guild.id} required>
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
      <button type="submit" disabled={nameError ? true : false}>Save</button>
      <button type="reset" onclick={() => handleEdit()}>Cancel</button>
    </form>
  {:else}
    <h2>Show</h2>
    {#if equipment_updated}
      <p style="color: yellow;">Character has changed. Please refresh</p>
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
      Active Spec
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
      Off Spec
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
    <ItemFrame equipment={data.equipment?.head ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.neck ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.shoulders ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.back ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.chest ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.shirt ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.tabard ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.wrist ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.hands ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.waist ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.legs ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.feet ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.ring_1 ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.ring_2 ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.trinket_1 ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.trinket_2 ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.main_hand ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.off_hand ?? null}></ItemFrame>
    <ItemFrame equipment={data.equipment?.ranged ?? null}></ItemFrame>
    <button onclick={() => handleEdit()}>Edit</button>
    <button onclick={() => handleRefresh()}>Refresh</button>
    <button onclick={() => handleDelete()}>Delete Character </button>
  {/if}
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>Loading</p>
{/if}

<br />
<button onclick={() => handleGoBack()}> Go back </button>

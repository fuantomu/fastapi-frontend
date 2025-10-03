<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import type { Character, Guild } from "$lib/types";
  import { Faction, Gender, PlayerClass, PlayerSpec, Race } from "$lib/consts";

  const id = page.url.pathname;
  let { data }: PageProps = $props();
  let character: Character | null = $state(data.item ?? null);
  let edit: Boolean = $state(false);
  let guilds : Guild[] = $state(data.guilds ?? [])
  let character_guild = data.guilds?.find((guild) => guild.id === character?.guild) ?? {"name": "Unknown", "id": 0}
  let current_character_class = $state(character?.character_class ?? "Adventurer")
  let current_character_spec = $state(character?.active_spec ?? "Adventurer")

  function handleGoBack() {
    goto("/characters");
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }
  function handleEdit() {
    edit = !edit;
  }

</script>

<h1>Test</h1>
{#if character}
  {#if edit}
    <h2>Edit</h2>
    <form method="POST">
      <input id="id" type="hidden" name="id" value={character.id} />
      <input id="name" type="text" name="name" value={character.name} />
      <input id="realm" name="realm" type="text" value={character.realm} placeholder="Realm" required />
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
      <select id="faction" name="faction" bind:value={character.faction} required>
        {#each Object.values(Faction) as faction}
          <option value={faction}>{faction}</option>
        {/each}
      </select>
      <select id="character_class" name="character_class" bind:value={current_character_class} required>
        {#each Object.values(PlayerClass) as character_class}
          <option value={character_class}>{character_class}</option>
        {/each}
      </select>
      <select id="active_spec" name="active_spec" bind:value={current_character_spec} required>
        {#each Object.entries(PlayerSpec).filter((entry) => entry[0].includes(current_character_class)) as active_spec}
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
      <button type="submit"
        >Save</button
      >
      <button type="reset" onclick={() => handleEdit()}>Cancel</button>
    </form>
  {:else}
    <h2>Show</h2>
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
    <button onclick={() => handleEdit()}>Edit</button>
    <button onclick={() => handleDelete()}>Delete Character </button>
  {/if}
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>Loading</p>
{/if}

<br />
<button onclick={() => handleGoBack()}> Go back </button>

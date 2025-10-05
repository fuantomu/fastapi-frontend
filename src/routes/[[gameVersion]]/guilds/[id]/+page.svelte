<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import type { Character, Guild } from "$lib/types";
  import { Faction } from "$lib/consts";
  import { getContext } from "svelte";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { t } from "$lib/i18n/index.svelte";

  const id = page.url.pathname;
  let { data }: PageProps = $props();
  let guild: Guild | null = $state(data.item ?? null);
  let edit: Boolean = $state(false);
  let nameInput: string = $state(guild?.name ?? "");
  let realmInput: string = $state(guild?.realm ?? "");
  let guilds: Guild[] = $state(data.guilds ?? []);
  let members: Character[] = $state(data.characters ?? []);
  const gameVersion = getContext<GameVersionName>("gameVersion");

  function handleGoBack() {
    goto(`/${gameVersion}/guilds`);
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }
  function handleEdit() {
    edit = !edit;
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
    nameError = guilds.some(
      (guild) =>
        guild.realm.trim().toLowerCase() === realm.trim().toLowerCase() &&
        guild.name.trim().toLowerCase() === name.trim().toLowerCase()
    )
      ? `"${name}" already exists on "${realm}".`
      : null;
  }
</script>

<h1>Test - {t(`version.${gameVersion}`)}</h1>
{#if guild}
  {#if edit}
    <h2>Edit</h2>
    <form method="POST">
      <input id="id" type="hidden" name="id" value={guild.id} />
      <input
        id="name"
        type="hidden"
        name="name"
        bind:value={nameInput}
        oninput={() => handleNameInput(nameInput)}
        required
      />
      {#if nameError}
        <p style="color: red;">{nameError}</p>
      {/if}
      <select id="faction" name="faction" bind:value={guild.faction} required>
        {#each Object.values(Faction) as faction}
          <option value={faction}>{faction}</option>
        {/each}
      </select>
      <input
        id="realm"
        name="realm"
        type="text"
        placeholder="Realm"
        bind:value={realmInput}
        oninput={() => handleRealmInput(realmInput)}
        required
      />
      <input
        id="achievement_points"
        name="achievement_points"
        type="number"
        value={guild.achievement_points}
        placeholder="0"
      />
      <input
        id="member_count"
        name="member_count"
        type="number"
        value={guild.member_count}
        placeholder="0"
      />
      <input
        id="created_timestamp"
        name="created_timestamp"
        type="date"
        value={new Date(guild.created_timestamp).toISOString().split("T")[0]}
        placeholder={new Date().toISOString().split("T")[0]}
      />
      <button type="submit">Save</button>
      <button type="reset" onclick={() => handleEdit()}>Cancel</button>
    </form>
  {:else}
    <h2>Show</h2>
    {guild.name}
    {guild.realm}
    {guild.faction}
    {guild.member_count}
    {guild.achievement_points}
    {new Date(guild.created_timestamp).toISOString().split("T")[0]}
    <br />
    Members
    <br />
    {#each members as members}
      {members.name}
      <br />
    {/each}
    <button onclick={() => handleEdit()}>Edit</button>
    <button onclick={() => handleDelete()}>Delete Guild</button>
  {/if}
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>Loading</p>
{/if}

<br />
<button onclick={() => handleGoBack()}> Go back </button>

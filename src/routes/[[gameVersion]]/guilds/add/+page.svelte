<script lang="ts">
  import { goto } from "$app/navigation";
  import { Faction } from "$lib/consts";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import type { PageProps } from "./$types";
  import { t } from "$lib/i18n/index.svelte";

  let nameInput: string = $state("");
  let realmInput: string = $state("");
  let { data }: PageProps = $props();
  let guilds = $state(data.guilds ?? []);

  const gameVersion = getContext<GameVersionName>("gameVersion");

  function handleGoBack() {
    goto(`/${gameVersion}/guilds`);
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
        guild.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        guild.version === gameVersion
    )
      ? `"${name}" already exists on "${realm}".`
      : null;
  }
</script>

<h1>Test {t(`version.${gameVersion}`)}</h1>
<form method="POST">
  <input id="id" type="hidden" name="id" value={0} />
  <input
    id="name"
    name="name"
    type="text"
    placeholder="Name"
    bind:value={nameInput}
    oninput={() => handleNameInput(nameInput)}
    required
  />
  {#if nameError}
    <p style="color: red;">{nameError}</p>
  {/if}
  <select id="faction" name="faction" required>
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
    placeholder="0"
  />
  <input id="member_count" name="member_count" type="number" placeholder="0" />
  <input
    id="created_timestamp"
    name="created_timestamp"
    type="date"
    value={new Date().toISOString().split("T")[0]}
  />
  <input
    id="gameVersion"
    type="hidden"
    name="gameVersion"
    value={gameVersion}
  />
  <button type="submit" disabled={nameError ? true : false}>Save</button>
</form>
<button onclick={() => handleGoBack()}> Go back </button>

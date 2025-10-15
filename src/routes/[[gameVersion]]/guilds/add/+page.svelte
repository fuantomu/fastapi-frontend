<script lang="ts">
  import { goto } from "$app/navigation";
  import { Faction, Region } from "$lib/consts";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import type { PageProps } from "./$types";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import type { Guild } from "$lib/types";

  let nameInput: string = $state("");
  let realmInput: string = $state("");
  let { data }: PageProps = $props();
  let guilds : Guild[] = $state(data.guilds ?? []);
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let selectedVersion: GameVersionName = $state(gameVersionFactory.gameVersion.getName());
  let selectedRegion: Region = $state(Region.EU);

  function handleGoBack() {
    goto(`/${gameVersionFactory.gameVersion.getName()}/guilds`);
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
      (guild : Guild) =>
        guild.realm.trim().toLowerCase() === realm.trim().toLowerCase() &&
        guild.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        guild.version === selectedVersion
    )
      ? `"${name}" already exists on "${realm}".`
      : null;
  }
</script>

<h1>Test {t(`version.${gameVersionFactory.gameVersion.getName()}`)}</h1>
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
  <select
    id="gameVersion"
    name="gameVersion"
    bind:value={selectedVersion}
    required
  >
    {#each Object.values(GameVersionName) as version}
      <option value={version}>{t(`version.${version}`)}</option>
    {/each}
  </select>
  <select id="region" name="region" bind:value={selectedRegion} required>
    {#each Object.values(Region) as region}
      <option value={region}>{t(`region.${region}`)}</option>
    {/each}
  </select>
  <button type="submit" disabled={nameError ? true : false}>Save</button>
</form>
<button onclick={() => handleGoBack()}> Go back </button>

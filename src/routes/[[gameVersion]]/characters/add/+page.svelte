<script lang="ts">
  import { goto } from "$app/navigation";
  import { Faction, Gender, PlayerClass, PlayerSpec, Race, Region } from "$lib/consts";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import type { PageProps } from "./$types";
  import { t } from "$lib/i18n/index.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  let nameInput: string = $state("");
  let realmInput: string = $state("");
  let { data }: PageProps = $props();
  let current_character_class = $state("Adventurer");
  let guilds = $state(data.guilds ?? []);
  let characters = $state(data.characters ?? []);
  let submitted: boolean = $state(false);

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let selectedVersion: GameVersionName = $state(gameVersionFactory.gameVersion.getName())
  let selectedRegion: Region = $state(Region.EU)

  function handleGoBack() {
    goto(`/${gameVersionFactory.gameVersion.getName()}/characters`);
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

  function onsubmit() {
    submitted = true;
  }
</script>

<h1>Test {t(`version.${gameVersionFactory.gameVersion.getName()}`)}</h1>
<form {onsubmit} method="POST">
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
  <input
    id="realm"
    name="realm"
    type="text"
    placeholder="Realm"
    bind:value={realmInput}
    oninput={() => handleRealmInput(realmInput)}
    required
  />
  <select id="gender" name="gender" required>
    {#each Object.values(Gender) as gender}
      <option value={gender}>{gender}</option>
    {/each}
  </select>
  <select id="race" name="race" required>
    {#each Object.values(Race) as race}
      <option value={race}>{race}</option>
    {/each}
  </select>
  <input id="level" name="level" type="number" placeholder="0" />
  <select id="guild" name="guild">
    <option value={null}>{"None"}</option>
    {#each guilds as guild}
      <option value={guild.id}>{guild.name}</option>
    {/each}
  </select>
  <select id="faction" name="faction" required>
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
  <select id="active_spec" name="active_spec" required>
    {#each Object.entries(PlayerSpec).filter( (entry) => entry[0].includes(current_character_class) ) as active_spec}
      <option value={active_spec[1]}>{active_spec[1]}</option>
    {/each}
  </select>
  <input
    id="achievement_points"
    name="achievement_points"
    type="number"
    placeholder="0"
  />
  <input
    id="average_item_level"
    name="average_item_level"
    type="number"
    placeholder="0"
  />
  <input
    id="equipped_item_level"
    name="equipped_item_level"
    type="number"
    placeholder="0"
  />
  <input
    id="last_login_timestamp"
    name="last_login_timestamp"
    type="datetime"
    placeholder={new Date().toISOString()}
  />
  <select id="gameVersion" name="gameVersion" bind:value={selectedVersion} required>
    {#each Object.values(GameVersionName) as version}
      <option value={version}>{t(`version.${version}`)}</option>
    {/each}
  </select>
  <select id="region" name="region" bind:value={selectedRegion} required>
    {#each Object.values(Region) as region}
      <option value={region}>{t(`region.${region}`)}</option>
    {/each}
  </select>
  <button {onsubmit} type="submit" disabled={nameError ? true : false}
    >{t("ui.save")}</button
  >
  {#if submitted}
    <p style="color: yellow;">
      {t("ui.existingCharacterFound")}
    </p>
  {/if}
</form>
<button onclick={() => handleGoBack()}> Go back </button>

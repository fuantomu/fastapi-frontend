<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Account, Character } from "$lib/types";
  import { getContext } from "svelte";
  import type { PageProps } from "./$types";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { t } from "$lib/i18n/index.svelte";
  import Title from "$lib/components/Title.svelte";

  let { data }: PageProps = $props();
  let characters: Character[] = $state(data.items ?? []);
  let searchValue: string = $state("");
  const gameVersion = getContext<GameVersionName>("gameVersion");
  let accountState = getContext<Account>("accountState");

  function handleAdd() {
    goto(`/${gameVersion}/armory/characters/add`);
  }

  function handleSearch(searchText: string) {
    characters =
      data.items?.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      ) ?? [];
  }
</script>

<Title title={t("title.armory.listCharacters")}></Title>
{#if characters}
  <input
    placeholder="Search"
    name="searchItems"
    bind:value={searchValue}
    oninput={() => handleSearch(searchValue)}
  />
  <ul>
    {#each characters as character}
      <li>
        <a href="/{gameVersion}/armory/characters/{character.id}"
          >{character.name} - {character.character_class}</a
        >
      </li>
    {/each}
  </ul>
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>{t("ui.loading")}</p>
{/if}
{#if accountState.level > 0}
  <button type="button" class="button-base" onclick={() => handleAdd()}
    >{t("ui.addNew")}</button
  >
{/if}

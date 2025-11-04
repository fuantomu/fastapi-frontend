<script lang="ts">
  import { enhance } from "$app/forms";
  import { Gender, ICON_QUESTIONMARK, Region } from "$lib/consts";
  import { t } from "$lib/i18n/index.svelte";
  import type { Account, Character, Guild } from "$lib/types";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { getContext } from "svelte";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import type { PlayerRace } from "$lib/versions/PlayerRace";
  import { PlayerFaction } from "$lib/versions/PlayerFaction";
  import { PlayerClass } from "$lib/versions/PlayerClass";
  import { PlayerSpec } from "$lib/versions/PlayerSpecialization";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";

  const { character } = $props<{
    character: Character;
  }>();

  let modal: HTMLDialogElement;
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let accountState = getContext<Account>("accountState");
  let isOpen: boolean = $state(false);

  function openModal() {
    isOpen = true;
    modal.showModal();
  }

  function closeModal() {
    isOpen = false;
    modal.close();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  async function deleteCharacter() {
    await fetch(`${PUBLIC_API_URL}/Character/?id=${character.id}&version=${gameVersionFactory.gameVersion.getName()}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    goto(`/${gameVersionFactory.gameVersion.getName()}/armory/characters/`);
  }
</script>

<div class="search-item">
  <div
    role="button"
    tabindex="0"
    onclick={() => openModal()}
    onkeydown={() => {}}
    style="
    background-color: var(--palette-secondary-main);
    display: flex; 
    align-items:center;
    justify-content:center;
    width: 20vw;
    border: 1px solid black;"
  >
    {t("ui.armory.deleteCharacter")}
  </div>
</div>
<dialog
  id="modal"
  aria-labelledby="modal-title"
  style="background-color: var(--palette-secondary-dark); width: 65vw;"
  bind:this={modal}
  closedby="any"
  onclose={closeModal}
  onkeydown={handleKeydown}
>
  <article>
    <header>
      <h4>
        {t("ui.armory.deleteCharacter")}
      </h4>
    </header>
    <div>
        {t("ui.armory.deleteConfirmation", {"character": character.name})}
    </div>
    <div class="search-item">
      <button
        type="button"
        onclick={() => deleteCharacter()}
        style="
        background-color: var(--palette-primary-main);
        display: flex; 
        align-items:center;
        justify-content:center;
        width: 20vw;
        border: 1px solid black;
        user-select: none;"
      >
        {t("ui.armory.delete")}
      </button>
      <button
        type="button"
        onclick={() => closeModal()}
        style="
        background-color: var(--palette-secondary-main);
        display: flex; 
        align-items:center;
        justify-content:center;
        width: 20vw;
        border: 1px solid black;
        user-select: none;"
      >
        {t("ui.armory.cancel")}
      </button>
    </div>
  </article>
</dialog>

<style>
  dialog {
    opacity: 100;

    &::backdrop {
      background: rgba(0, 0, 0, 0.66); /* dim the background */
    }
    h4 {
      user-select: none;
    }
  }
  .search-item {
    display: flex;
    margin-top: 30px;
    justify-content: center;
    align-content: center;
    height: 48px;
    width: 100%;
  }
</style>

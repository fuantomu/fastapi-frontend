<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { tokenTimeout } from "$lib/helper/timeout";
  import { t } from "$lib/i18n/index.svelte";
  import type { Account } from "$lib/types";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";

  let username: string = $state("");
  let password: string = $state("");
  let modal: HTMLDialogElement;
  let isOpen: boolean = $state(false);
  let checkLogin: boolean = $state(false);
  let register: boolean = $state(false);
  let accountState = getContext<Account>("accountState");
  let infoMessage: { msg: string; type: string } = $state({
    msg: "",
    type: "",
  });
  let loggedIn: boolean = $state(accountState.username ? true : false);
  let showPassword : boolean = $state(false)
  const gameVersion = getContext<GameVersionName>("gameVersion")

  $effect(() => {
    document.body.style.cursor = checkLogin ? "wait" : "";
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  function openModal() {
    isOpen = true;
    modal.showModal();
  }

  function closeModal() {
    isOpen = false;
    register = false;
    checkLogin = false;
    password = ""
    username = ""
    infoMessage.msg = ""
    infoMessage.type = ""
    modal.close();
  }

  function onTimeout() {
    loggedIn = false;
    console.log("timeout");
    accountState.username = "";
    accountState.level = 0;
    accountState.guild = -1;
    accountState.characters = []
  }
</script>

<div>
  {#if !loggedIn}
    <div
      class="text"
      style="display: grid; align-items: center; text-align: center; gap: 10px;"
    >
      {t("ui.account.loggedInFalse")}<button
        class="button-base"
        type="button"
        onclick={openModal}
      >
        {t("ui.account.account")}
      </button>
    </div>
  {:else}
    <div
      class="text"
      style="display: block; height: 40px; align-items: center; text-align: center"
      role="button"
      tabindex=0
      onclick={() => goto(`/${gameVersion}/options/${accountState.username}`)}
      onkeydown={() => {}}
    >
      {t("ui.account.loggedInTrue")}<br />{accountState.username}
    </div>
  {/if}
</div>
<dialog
  id="modal"
  aria-labelledby="modal-title"
  style="background-color: var(--palette-secondary-dark);"
  bind:this={modal}
  closedby="any"
  onclose={closeModal}
  onkeydown={handleKeydown}
>
  <form
    method="POST"
    action={register ? "/account/?/register" : "/account/?/login"}
    use:enhance={() => {
      checkLogin = true;

      return async ({ update, result }) => {
        await update();

        if (result.type === "failure" && result.data) {
          infoMessage.msg = (result.data["error"] as string).includes("exists")
            ? t("ui.account.exists")
            : t("ui.account.incorrectCredentials");
          infoMessage.type = "error";
          checkLogin = false;
        } else if (result.type === "success" && result.data) {
          // Register
          if (result.data.created) {
            checkLogin = false;
            register = false;
            infoMessage.msg = t("ui.account.created");
            infoMessage.type = "register";
          }
          // Login
          else {
            checkLogin = false;
            cookieStore.set("session", result.data["session"] as string);
            cookieStore.set(
              "timeout",
              new Date(
                Date.now() + Number(result.data.timeout) * 1000
              ).toLocaleString()
            );
            const response = await fetch(
              `${PUBLIC_API_URL}/Account/?username=${result.data["username"]}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const data = await response.json();
            if (data["Result"]) {
              accountState.level = Number(data["Result"]["level"]);
              accountState.username = data["Result"]["username"];
              accountState.creation_time = Number(
                data["Result"]["creation_time"]
              );
              if (data["Result"]["guild"]) {
                accountState.guild = Number(data["Result"]["guild"]);
              } else {
                accountState.guild = -1;
              }
              accountState.characters = data["Result"]["characters"]
            }

            if (result.data.timeout) {
              tokenTimeout(Number(result.data.timeout), onTimeout);
              loggedIn = true;
              closeModal();
            }
          }
        }
      };
    }}
  >
    <article>
      <header>
        <h4>{register ? t("ui.account.register") : t("ui.account.login")}</h4>
      </header>

      {#if infoMessage.msg}
        <span class={infoMessage.type}>{infoMessage.msg}</span>
      {/if}

      <div style="grid-template-columns: 30% 40%" class="row">
        <span class="text">{t("ui.account.name")}</span>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          minlength="3"
          bind:value={username}
          spellcheck="false"
          autocomplete="off"
          class="textinput"
          required
          oninput={() => (infoMessage = {msg: "", type: ""})}
          title={t("ui.account.name")}
        />
      </div>
      <div style="grid-template-columns: 30% 40%" class="row">
        <span class="text">{t("ui.account.password")}</span>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          minlength="8"
          bind:value={password}
          spellcheck="false"
          autocomplete="off"
          class="textinput"
          required
          oninput={() => (infoMessage = {msg: "", type: ""})}
          title={t("ui.account.password")}
        />
        <button
            type="button"
            onmousedown={() => {
              showPassword = true;
            }}
            onmouseup={() => {
              showPassword = false;
            }}
            style="
              position: absolute; 
              display: inline-block;
              bottom: 105px;
              left: 625px; 
              height: 26px; 
              width: 26px;
              border: none;
              padding: none;
              background: transparent"
            title={t("ui.button.showPassword")}
            ><img
              src="/image/ui/icon_eye.png"
              style="position: absolute; bottom: 0px; left: 0px; width: 32px; height: 32px;"
              alt={t("ui.button.showPassword")}
            /></button
          >
      </div>
      <div style="display: flex; justify-content: space-between;">
        <div>
          <button type="submit" class="button-base"
            >{t("ui.account.submit")}</button
          >
          <button type="button" class="button-base" onclick={() => closeModal()}
            >{t("ui.account.cancel")}</button
          >
        </div>
        <div>
          <button
            type="button"
            class="button-base"
            onclick={() => (register = !register)}
            >{register
              ? t("ui.account.login")
              : t("ui.account.register")}</button
          >
        </div>
      </div>
    </article>
  </form>
</dialog>

<style>
  .register {
    font-size: large;
    font-weight: bold;
    text-shadow: none;
    color: greenyellow;
  }
  dialog {
    opacity: 100;

    &::backdrop {
      background: rgba(0, 0, 0, 0.66); /* dim the background */
    }

    & article {
      & header {
        & h4 {
          font-size: clamp(var(--h5), 1.75vw, var(--h2));
          font-weight: 200;
          line-height: 1;
          margin: -2.5rem 0 2rem 0;
          letter-spacing: -1px;
          text-shadow: none;
        }
      }
    }
  }
</style>

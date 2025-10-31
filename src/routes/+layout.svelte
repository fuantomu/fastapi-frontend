<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_URL } from "$env/static/public";
  import BottomBar from "$lib/components/Bar/BottomBar.svelte";
  import { createAccountState } from "$lib/helper/accountState.svelte";
  import { clearTokenTimeout, tokenTimeout } from "$lib/helper/timeout";
  import type { Account } from "$lib/types";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { GameVersionFactory } from "$lib/versions/GameVersionFactory";
  import { onDestroy, setContext } from "svelte";
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
  try {
    let location = window.location.pathname.split("/")[1];
    setContext("gameVersion", location);
    setContext(
      "gameVersionFactory",
      GameVersionFactory.getContext(
        GameVersionName[location.toUpperCase() as keyof typeof GameVersionName]
      )
    );
  } catch (err) {
    console.log(err);
    goto("/mop");
    setContext("gameVersion", GameVersionName.MOP);
    setContext(
      "gameVersionFactory",
      GameVersionFactory.getContext(GameVersionName.MOP)
    );
  }
  let accountState = createAccountState({} as Account);
  setContext("accountState", accountState);

  let getSession = async () => {
    const cookie = await cookieStore.get("session");

    if (cookie?.value) {
      const response = await fetch(
        `${PUBLIC_API_URL}/Account/Session?session=${cookie?.value}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (
        data["Result"] &&
        Number.isSafeInteger(Number(data["Result"].timeout))
      ) {
        tokenTimeout(Number(data["Result"].timeout), onTimeout);
        cookieStore.set("timeout", new Date(Date.now() + Number(data["Result"].timeout * 1000)).toLocaleString())
        const account = await fetch(
          `${PUBLIC_API_URL}/Account/?username=${data["Result"].username}`,
          {
            method: "GET",
          }
        );
        const account_data = await account.json();
        if (account_data["Result"]) {
          accountState.username = account_data["Result"].username;
          accountState.level = account_data["Result"].level;
          accountState.creation_time = account_data["Result"].creation_time;
          accountState.guild = account_data["Result"].guild;
        }
      } else {
        await cookieStore.delete("session");
      }
    }
  };

  function onTimeout() {
    accountState.username = ""
    accountState.level = 0
    accountState.guild = -1
  }

  onDestroy(() => {
    clearTokenTimeout();
  });
</script>

<div class="container">
  {#await getSession() then}
    {@render children()}
  {/await}
  <BottomBar></BottomBar>
</div>

<style>
  .container {
    padding-bottom: var(--bottom-bar-size, 70px);
  }
  :global(select:hover),
  :global(body) {
    cursor:
      url("/image/ui/cursor_default.png") 0 0,
      auto;
  }
  :global(input:hover),
  :global(button:hover),
  :global([role="button"]:hover),
  :global(.clickable:hover) {
    cursor:
      url("/image/ui/cursor_hover.png") 0 0,
      auto;
  }
  :global(a:hover) {
    cursor:
      url("/image/ui/cursor_inspect.png") 0 0,
      auto;
  }
  :global(button:disabled){
    cursor: not-allowed;
  }
</style>

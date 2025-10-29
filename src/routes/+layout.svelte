<script lang="ts">
  import BottomBar from "$lib/components/Bar/BottomBar.svelte";
  import Title from "$lib/components/Title.svelte";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { GameVersionFactory } from "$lib/versions/GameVersionFactory";
  import { setContext } from "svelte";
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
    console.log(err)
    window.location.href = "/mop";
    setContext("gameVersion", GameVersionName.MOP);
    setContext(
      "gameVersionFactory",
      GameVersionFactory.getContext(GameVersionName.MOP)
    );
  }
</script>

<div class="container">
  <slot style="height: 1700px" />
  <BottomBar></BottomBar>
</div>

<style>
  .container {
    padding-bottom: var(--bottom-bar-size, 70px);
  }
  :global(select:hover),
  :global(body) {
    cursor: url('/image/ui/cursor_default.png') 0 0, auto;
  }
  :global(input:hover),
  :global(button:hover),
  :global([role="button"]:hover),
  :global(.clickable:hover) {
    cursor: url('/image/ui/cursor_hover.png') 0 0, auto;
  }
  :global(a:hover) {
    cursor: url('/image/ui/cursor_inspect.png') 0 0, auto;
  }
</style>

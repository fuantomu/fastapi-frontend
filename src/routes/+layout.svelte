<script lang="ts">
  import BottomBar from "$lib/components/Bar/BottomBar.svelte";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { GameVersionFactory } from "$lib/versions/GameVersionFactory";
  import { setContext } from "svelte";
  try {
    let location = window.location.pathname.split("/")[1];
    console.log(location)
    setContext("gameVersion", location);
    setContext(
      "gameVersionFactory",
      GameVersionFactory.getContext(
        GameVersionName[location.toUpperCase() as keyof typeof GameVersionName]
      )
    );
  } catch (err) {
    window.location.href = "/mop";
    setContext("gameVersion", GameVersionName.MOP);
    setContext(
      "gameVersionFactory",
      GameVersionFactory.getContext(GameVersionName.MOP)
    );
  }
</script>

<div class="container">
  <slot />
  <BottomBar></BottomBar>
</div>

<style>
  .container {
    padding-bottom: var(--bottom-bar-size, 70px);
  }
</style>

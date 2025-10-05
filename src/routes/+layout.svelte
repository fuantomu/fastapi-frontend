<script>
  import BottomBar from "$lib/components/Bar/BottomBar.svelte";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { setContext } from "svelte";
  try {
    setContext("gameVersion", window.location.pathname.split("/")[1]);
  } catch (err) {
    window.location.href = "/mop";
    setContext("gameVersion", GameVersionName.MOP);
  }
</script>

<div class="container">
  <slot />
  <BottomBar></BottomBar>
</div>

<style>
  .container {
    padding-bottom: var(--bottom-bar-height, 64px);
  }
</style>

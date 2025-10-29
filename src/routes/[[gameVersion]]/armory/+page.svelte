<script lang="ts">
  import { goto } from "$app/navigation";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";

  function handleGoto(newPage: string) {
    switch (newPage) {
      case "Characters":
        goto(`armory/characters`);
        break;
    }
  }
</script>

<h1>
  Welcome to the Armory
</h1>
<button type="button" class="button-base" onclick={() => handleGoto("Characters")}> Go to Characters </button>

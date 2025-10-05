<script lang="ts">
  import { goto } from "$app/navigation";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import { t } from "$lib/i18n/index.svelte";

  const gameVersion = getContext<GameVersionName>("gameVersion");

  function handleGoto(newPage: string) {
    switch (newPage) {
      case "Characters":
        goto(`${gameVersion}/characters`);
        break;
      case "Guilds":
        goto(`${gameVersion}/guilds`);
        break;
    }
  }
</script>

<h1>
  Welcome to the Armory - {t(`version.${gameVersion}`)}
</h1>
<button onclick={() => handleGoto("Characters")}> Go to Characters </button>
<button onclick={() => handleGoto("Guilds")}> Go to Guilds </button>

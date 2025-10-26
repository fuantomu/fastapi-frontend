<script lang="ts">
  import { goto } from "$app/navigation";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import { t } from "$lib/i18n/index.svelte";

  const gameVersion = getContext<GameVersionName>("gameVersion");

  function handleGoto(newPage: string) {
    switch (newPage) {
      case "Characters":
        goto(`armory/characters`);
        break;
    }
  }
</script>

<h1>
  Welcome to the Armory - {t(`version.${gameVersion}`)}
</h1>
<button type="button" class="button-base" onclick={() => handleGoto("Characters")}> Go to Characters </button>

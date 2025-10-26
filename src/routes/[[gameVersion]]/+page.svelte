<script lang="ts">
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext } from "svelte";
  import { t } from "$lib/i18n/index.svelte";

  const gameVersion = getContext<GameVersionName>("gameVersion");

</script>

<h1>
  GameVersion - {t(`version.${gameVersion}`)}
</h1>

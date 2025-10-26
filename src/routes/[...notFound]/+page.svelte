<script lang="ts">
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext, onMount } from "svelte";


    const gameVersion = getContext<GameVersionName>("gameVersion");

    onMount(() => {
        window.location.href = `/${gameVersion??"mop"}/`;
    });
</script>
<script lang="ts">
  import { goto } from "$app/navigation";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import { getContext, onMount } from "svelte";


    const gameVersion = getContext<GameVersionName>("gameVersion");

    onMount(() => {
        goto(`/${gameVersion??"mop"}/`)
    });
</script>
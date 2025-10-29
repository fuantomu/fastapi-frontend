<script lang="ts">
  import type { PageProps } from "./$types";
  import ArmoryFrame from "$lib/components/character/ArmoryFrame.svelte";
  let { data }: PageProps = $props();

</script>

{#if data.characters && data.guilds}
  <ArmoryFrame id={0}></ArmoryFrame>
{/if}

<script lang="ts">
  import type { PageProps } from "./$types";
  import ArmoryFrame from "$lib/components/Armory/ArmoryFrame.svelte";

  let { data }: PageProps = $props();
</script>

{#if data.id}
  <ArmoryFrame id={Number(data?.id)} />
{/if}

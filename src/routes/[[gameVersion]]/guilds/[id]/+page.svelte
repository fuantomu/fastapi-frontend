<script lang="ts">
  import type { PageProps } from "./$types";
  import GuildFrame from "$lib/components/Guild/GuildFrame.svelte";

  let { data }: PageProps = $props();
</script>

{#if data.id}
  <GuildFrame id={Number(data?.id)}/>
{/if}
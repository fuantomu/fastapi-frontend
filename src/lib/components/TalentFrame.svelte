<script lang="ts">
  import type { Talent } from "$lib/types";

  export let talent: Talent | null;
</script>

{#if talent}
  <a href={`https://www.wowhead.com/mop-classic/spell=${talent.id}`}>{talent.name}</a>
  <br />
{/if}

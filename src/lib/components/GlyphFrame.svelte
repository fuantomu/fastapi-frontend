<script lang="ts">
  import type { Glyph } from "$lib/types";

  export let glyph: Glyph | null;
</script>

{#if glyph}
  <a href={`https://www.wowhead.com/mop-classic/spell=${glyph.id}`}>{glyph.name}</a>
  <br />
{/if}

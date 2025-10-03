<script lang="ts">
  import type { CharacterItem } from "$lib/types";

  export let equipment: CharacterItem | null;
</script>

{#if equipment}
  <a
    href={`https://www.wowhead.com/mop-classic/item=${equipment.id}`}
    data-wowhead={`${equipment.wowhead_link}`}
  >
    {equipment.name}
  </a>
  <br />
{/if}

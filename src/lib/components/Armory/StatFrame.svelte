<script lang="ts">
  import type { RatingModel } from "$lib/types";
  import { t } from "$lib/i18n/index.svelte";
  export let stat: string | RatingModel;
  export let statName: string;
</script>

<div style="display: flex; align-items: center; padding-bottom: 1px">
  {#if stat}
    {t(`character.${statName}`)}:
    <span style="color: var(--ui-colour-{statName}); margin-left: 10px;">
      {#if stat instanceof Object}
        {stat.value.toFixed(2)}% ({stat.rating})
      {:else}
        {stat}
      {/if}
    </span>
  {/if}
</div>

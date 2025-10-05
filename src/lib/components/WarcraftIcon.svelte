<script lang="ts">
  import { ICON_QUESTIONMARK } from "$lib/consts";
  import Tooltip, { Wrapper } from "@smui/tooltip";

  export let src: string;
  export let label: string = "";

  let checkSource = () => {
    if (src){
      if (!src.includes("worldofwarcraft.com")){
        return `https://render-eu.worldofwarcraft.com/icons/56/${src}.jpg`
      }
      return src
    }
    return `https://render-eu.worldofwarcraft.com/icons/56/${ICON_QUESTIONMARK}.jpg`
  }
</script>

<Wrapper>
  {#if !src}
    <img src={`https://render-eu.worldofwarcraft.com/icons/56/${ICON_QUESTIONMARK}.jpg`} alt={label} class="warcraft-icon" />
  {:else}
    <img src={checkSource()} alt={label} class="warcraft-icon" />
  {/if}
  
  {#if label}
    <Tooltip>{label}</Tooltip>
  {/if}
</Wrapper>

<style>
  .warcraft-icon {
    width: var(--spacing-xl);
    height: var(--spacing-xl);
    vertical-align: middle;
  }
</style>

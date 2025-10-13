<script lang="ts">
  import { ICON_QUESTIONMARK } from "$lib/consts";
  import Tooltip, { Wrapper } from "@smui/tooltip";

  export let src: string;
  export let label: string = "";
  export let grayscale: boolean = false;

  let checkSource = () => {
    if (src) {
      if (!src.includes("worldofwarcraft.com")) {
        return `https://render-eu.worldofwarcraft.com/icons/56/${src}.jpg`;
      }
      return src;
    }
    return `https://render-eu.worldofwarcraft.com/icons/56/${ICON_QUESTIONMARK}.jpg`;
  };
</script>

<Wrapper>
  {#if !src}
    <img
      src={`https://render-eu.worldofwarcraft.com/icons/56/${ICON_QUESTIONMARK}.jpg`}
      alt={label}
      class="warcraft-icon {grayscale ? 'grayscale' : ''}"
    />
  {:else}
    {#key src}
      <img src={checkSource()} alt={label} class="warcraft-icon {grayscale ? 'grayscale' : ''}" onerror={() => src=checkSource().replace("classic1x","classic")} />
    {/key}
  {/if}

  {#if label}
    <Tooltip>{label}</Tooltip>
  {/if}
</Wrapper>

<style>
  .warcraft-icon {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }

  .warcraft-icon.grayscale {
    filter: grayscale(100%);
  }
</style>

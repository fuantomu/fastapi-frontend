<script lang="ts">
  import type { CharacterEquipment } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import ItemFrame from "./ItemFrame.svelte";
  import ItemEditFrame from "./ItemEditFrame.svelte";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  let { equipment = $bindable(), edit } = $props<{
    equipment: CharacterEquipment;
    edit: boolean;
  }>();
</script>

<div
  style="background-color: #111111; border: 1px solid black; padding: 20px; min-height: 400px;"
>
  <div style="display: flex; justify-content: space-between;">
    <div style="display: flex; flex-direction: column; gap: 6px;">
      {#if edit}
        <ItemEditFrame
          bind:equipment={equipment.head}
          slot={"head"}
          reverse={false}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.neck}
          slot={"neck"}
          reverse={false}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.shoulders}
          slot={"shoulders"}
          reverse={false}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.back}
          slot={"chest"}
          reverse={false}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.chest}
          slot={"chest"}
          reverse={false}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.shirt}
          slot={"shirt"}
          reverse={false}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.tabard}
          slot={"tabard"}
          reverse={false}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.wrist}
          slot={"wrist"}
          reverse={false}
        ></ItemEditFrame>
      {:else}
        <ItemFrame equipment={equipment.head} slot={"head"} reverse={false}
        ></ItemFrame>
        <ItemFrame equipment={equipment.neck} slot={"neck"} reverse={false}
        ></ItemFrame>
        <ItemFrame
          equipment={equipment.shoulders}
          slot={"shoulders"}
          reverse={false}
        ></ItemFrame>
        <ItemFrame equipment={equipment.back} slot={"chest"} reverse={false}
        ></ItemFrame>
        <ItemFrame equipment={equipment.chest} slot={"chest"} reverse={false}
        ></ItemFrame>
        <ItemFrame equipment={equipment.shirt} slot={"shirt"} reverse={false}
        ></ItemFrame>
        <ItemFrame equipment={equipment.tabard} slot={"tabard"} reverse={false}
        ></ItemFrame>
        <ItemFrame equipment={equipment.wrist} slot={"wrist"} reverse={false}
        ></ItemFrame>
      {/if}
    </div>
    <div
      style="display: flex; flex-direction: column; gap: 6px; align-items: end; justify-items: end"
    >
      {#if edit}
        <ItemEditFrame
          bind:equipment={equipment.hands}
          slot={"hands"}
          reverse={true}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.waist}
          slot={"waist"}
          reverse={true}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.legs}
          slot={"legs"}
          reverse={true}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.feet}
          slot={"feet"}
          reverse={true}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.ring_1}
          slot={"ring_1"}
          reverse={true}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.ring_2}
          slot={"ring_2"}
          reverse={true}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.trinket_1}
          slot={"trinket_1"}
          reverse={true}
        ></ItemEditFrame>
        <ItemEditFrame
          bind:equipment={equipment.trinket_2}
          slot={"trinket_2"}
          reverse={true}
        ></ItemEditFrame>
      {:else}
        <ItemFrame equipment={equipment.hands} slot={"hands"} reverse={true}
        ></ItemFrame>
        <ItemFrame equipment={equipment.waist} slot={"waist"} reverse={true}
        ></ItemFrame>
        <ItemFrame equipment={equipment.legs} slot={"legs"} reverse={true}
        ></ItemFrame>
        <ItemFrame equipment={equipment.feet} slot={"feet"} reverse={true}
        ></ItemFrame>
        <ItemFrame equipment={equipment.ring_1} slot={"ring_1"} reverse={true}
        ></ItemFrame>
        <ItemFrame equipment={equipment.ring_2} slot={"ring_2"} reverse={true}
        ></ItemFrame>
        <ItemFrame
          equipment={equipment.trinket_1}
          slot={"trinket_1"}
          reverse={true}
        ></ItemFrame>
        <ItemFrame
          equipment={equipment.trinket_2}
          slot={"trinket_2"}
          reverse={true}
        ></ItemFrame>
      {/if}
    </div>
  </div>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      gap: 16px;
    "
  >
    {#if edit}
      <ItemEditFrame
        bind:equipment={equipment.main_hand}
        slot={"main_hand"}
        reverse={false}
      ></ItemEditFrame>
      {#if equipment.main_hand?.inventory_type !== "Two-Hand" && equipment.main_hand?.inventory_type !== "Ranged"}
        <ItemEditFrame
          bind:equipment={equipment.off_hand}
          slot={"off_hand"}
          reverse={false}
        ></ItemEditFrame>
      {/if}
      {#if ["classic", "tbc", "wotlk", "cata"].includes(gameVersionFactory.gameVersion.getName())}
        <ItemEditFrame
          bind:equipment={equipment.ranged}
          slot={"ranged"}
          reverse={false}
        ></ItemEditFrame>
      {/if}
    {:else}
      <ItemFrame
        equipment={equipment.main_hand}
        slot={"main_hand"}
        reverse={false}
      ></ItemFrame>
      {#if equipment.main_hand?.inventory_type !== "Two-Hand" && equipment.main_hand?.inventory_type !== "Ranged"}
        <ItemFrame
          equipment={equipment.off_hand}
          slot={"off_hand"}
          reverse={false}
        ></ItemFrame>
      {/if}
      {#if ["classic", "tbc", "wotlk", "cata"].includes(gameVersionFactory.gameVersion.getName())}
        <ItemFrame equipment={equipment.ranged} slot={"ranged"} reverse={false}
        ></ItemFrame>
      {/if}
    {/if}
  </div>
</div>

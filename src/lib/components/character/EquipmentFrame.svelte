<script lang="ts">
  import type { CharacterEquipment } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import ItemFrame from "../ItemFrame.svelte";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  const { equipment } = $props<{
    equipment: CharacterEquipment;
  }>();
</script>

<div style="background-color: #111111; border: 1px solid black; padding: 20px;">
  <div style="display: flex; justify-content: space-between;">
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <ItemFrame equipment={equipment.head} slot={"head"}></ItemFrame>
      <ItemFrame equipment={equipment.neck} slot={"neck"}></ItemFrame>
      <ItemFrame equipment={equipment.shoulders} slot={"shoulders"}></ItemFrame>
      <ItemFrame equipment={equipment.back} slot={"chest"}></ItemFrame>
      <ItemFrame equipment={equipment.chest} slot={"chest"}></ItemFrame>
      <ItemFrame equipment={equipment.shirt} slot={"shirt"}></ItemFrame>
      <ItemFrame equipment={equipment.tabard} slot={"tabard"}></ItemFrame>
      <ItemFrame equipment={equipment.wrist} slot={"wrist"}></ItemFrame>
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px; align-items: end">
      <ItemFrame equipment={equipment.hands} slot={"hands"} reverse={true}></ItemFrame>
      <ItemFrame equipment={equipment.waist} slot={"waist"} reverse={true}></ItemFrame>
      <ItemFrame equipment={equipment.legs} slot={"legs"} reverse={true}></ItemFrame>
      <ItemFrame equipment={equipment.feet} slot={"feet"} reverse={true}></ItemFrame>
      <ItemFrame equipment={equipment.ring_1} slot={"ring"} reverse={true}></ItemFrame>
      <ItemFrame equipment={equipment.ring_2} slot={"ring"} reverse={true}></ItemFrame>
      <ItemFrame equipment={equipment.trinket_1} slot={"trinket"} reverse={true}></ItemFrame>
      <ItemFrame equipment={equipment.trinket_2} slot={"trinket"} reverse={true}></ItemFrame>
    </div>
  </div>
  <div
    style="
      display: flex;
      justify-content: center;
      gap: 10px;
    "
  >
    <ItemFrame equipment={equipment.main_hand} slot={"main_hand"}></ItemFrame>
    {#if equipment.main_hand?.inventory_type !== "Two-Hand" && equipment.main_hand?.inventory_type !== "Ranged"}
      <ItemFrame equipment={equipment.off_hand} slot={"off_hand"}></ItemFrame>
    {/if}
    {#if ["classic", "tbc", "wotlk", "cataclysm"].includes(gameVersionFactory.gameVersion.getName())}
      <ItemFrame equipment={equipment.ranged} slot={"ranged"}></ItemFrame>
    {/if}
  </div>
</div>

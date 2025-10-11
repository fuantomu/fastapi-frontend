<script lang="ts">
  import type { CharacterSpec, Talent as TalentType } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { t } from "$lib/i18n/index.svelte";
  import type { PlayerClass } from "$lib/consts";
  import type { PlayerTalent } from "$lib/versions/PlayerTalent";
  import TalentFrameRow from "./TalentFrameRow.svelte";
  import type { Talent, TalentRow } from "$lib/versions/GameVersionTypes";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  const { specialization, character_class, level, active } = $props<{
    specialization: CharacterSpec;
    character_class: PlayerClass;
    level: number;
    active: boolean;
  }>();

  const talents: TalentRow =
    gameVersionFactory.gameVersion.getTalents()[
      character_class.toLowerCase() as keyof PlayerTalent
    ];
  type TalentLevel = 15 | 30 | 45 | 60 | 75 | 90;

  

  function getTalentTiers(){
    const talentTiers = [15, 30, 45, 60, 75, 90]
    return talentTiers
  }
</script>

<div
  style="background-color: #111111; border: 1px solid black; padding: 20px; display: flex; flex-direction: column; min-height: 400px;"
>
  <span style="align-self: center; margin-bottom: 15px">
    {active ? t("character.activeSpec") : t("character.offSpec")} : {t(
      `specs.${character_class}${specialization.name}`
    )}
  </span>

  {#if gameVersionFactory.gameVersion.getName() === "mop"}
    {#each getTalentTiers() as tier}
      {console.log(level,tier,tier<level)}
      <TalentFrameRow
        talents={talents[tier as TalentLevel]}
        row={tier}
        active_talent={talents[tier as TalentLevel]?.find((el: Talent) => {
          return specialization.talents?.find((addr: TalentType) => {
            return addr.id === el.id;
          });
        })}
        inactive={tier <= level}
      ></TalentFrameRow>
    {/each}
  {:else}
    <div style="display: flex; justify-content: space-between;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        TODO: Classic Talents
      </div>
      <div
        style="display: flex; flex-direction: column; gap: 4px; align-items: end"
      >
        TODO: Classic Talents
      </div>
    </div>
  {/if}
</div>

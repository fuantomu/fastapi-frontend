<script lang="ts">
  import type { CharacterSpec, Talent as TalentType } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { t } from "$lib/i18n/index.svelte";
  import type { PlayerClass } from "$lib/consts";
  import type { PlayerTalent } from "$lib/versions/PlayerTalent";
  import TalentFrameRow from "./TalentFrameRow.svelte";
  import type { Talent, TalentRow } from "$lib/versions/GameVersionTypes";
  import TalentTreeFrame from "./TalentTreeFrame.svelte";

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
      <TalentFrameRow
        talents={talents[tier as TalentLevel]}
        row={tier}
        active_talent={talents[tier as TalentLevel]?.find((_talent: Talent) => {
          return specialization.talents?.find((t_type: TalentType) => {
            return t_type.id === _talent.id;
          });
        })}
        inactive={tier <= level}
      ></TalentFrameRow>
    {/each}
  {:else}
    <TalentTreeFrame talents={talents.talent_tree} character_talents={specialization.talents} character_class={character_class}></TalentTreeFrame>
  {/if}
</div>

<script lang="ts">
  import type { CharacterSpec, Talent as TalentType } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { t } from "$lib/i18n/index.svelte";
  import {
    ICON_QUESTIONMARK,
    PlayerClass as PlayerClassType,
  } from "$lib/consts";
  import type { PlayerTalent } from "$lib/versions/PlayerTalent";
  import TalentFrameRow from "./TalentFrameRow.svelte";
  import type { Talent, TalentRow } from "$lib/versions/GameVersionTypes";
  import TalentTreeFrame from "./TalentTreeFrame.svelte";
  import type { PlayerSpec } from "$lib/versions/PlayerSpecialization";
  import IconButton from "@smui/icon-button";
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import Menu from "@smui/menu";
  import List, { Item, Text } from "@smui/list";
  import { getMaxTalentPoints, getSpentPoints } from "$lib/helper/talents";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let {
    specialization,
    character_class,
    level,
    edit = false,
  } = $props<{
    specialization: CharacterSpec;
    character_class: PlayerClassType;
    level: number;
    edit: boolean;
  }>();

  let openSpec = $state(false);

  let active_talents = $state({
    15: -1 as number | undefined,
    30: -1 as number | undefined,
    45: -1 as number | undefined,
    60: -1 as number | undefined,
    75: -1 as number | undefined,
    90: -1 as number | undefined,
  });

  let talents: TalentRow = $state(
    gameVersionFactory.gameVersion.getTalents()[
      character_class?.toLowerCase() as keyof PlayerTalent
    ] ?? {}
  );

  let class_specs: PlayerSpec[] = $state(
    gameVersionFactory.gameVersion
      .getSpecs()
      .filter(
        (_spec) =>
          _spec.playerClass.name ===
          `${character_class ?? PlayerClassType.Adventurer}`
      ) ?? []
  );

  Object.entries(active_talents).forEach(([key, _]) => {
    active_talents[Number(key) as TalentLevel] =
      talents[Number(key) as TalentLevel]?.find((_talent: Talent) => {
        return specialization.talents?.find((t_type: TalentType) => {
          return t_type.id === _talent.id;
        });
      })?.id ?? undefined;
  });

  function getSpecIcon() {
    return (
      gameVersionFactory.gameVersion
        .getSpecs()
        .find(
          (spec: PlayerSpec) =>
            spec.playerClass.name === character_class &&
            spec.name === `${specialization.name ?? "Adventurer"}`
        ) ??
      ({
        name: specialization.name ?? "Adventurer",
        icon: ICON_QUESTIONMARK,
      } as PlayerSpec)
    );
  }

  $effect(() => {
    talents =
      gameVersionFactory.gameVersion.getTalents()[
        character_class?.toLowerCase() as keyof PlayerTalent
      ];
    class_specs =
      gameVersionFactory.gameVersion
        .getSpecs()
        .filter(
          (_spec) =>
            _spec.playerClass.name ===
            `${character_class ?? PlayerClassType.Adventurer}`
        ) ?? [];
  });
  type TalentLevel = 15 | 30 | 45 | 60 | 75 | 90;

  function updateActiveTalent(talent: Talent, key: string) {
    const isActive = specialization.talents?.find(
      (_talent: Talent) => talent.id === _talent.id
    );
    if (isActive) {
      specialization.talents[Number(key) / 15 - 1] = {
        id: -1,
        name: "Unknown",
        icon: null,
        rank: 0,
      };
    } else {
      specialization.talents[Number(key) / 15 - 1] = talent;
    }
  }

  function updateActiveCell(talents: Talent[]) {
    specialization.talents = talents;
  }

  function handleReset() {
    for (let index = 0; index < specialization.talents.length; index++) {
      specialization.talents[index] = {
        id: -1,
        name: "Unknown",
        icon: null,
        rank: 0,
      };
    }
  }
</script>

<div
  style="background-color: #111111; border: 1px solid black; padding: 20px; display: flex; flex-direction: column; min-height: 400px;"
>
  <div
    style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; justify-content: center; gap: 120px"
  >
    <span>
      {specialization.spec_id == 0
        ? t("character.activeSpec")
        : t("character.offSpec")} : {specialization.name
        ? t(`specs.${specialization.name}`)
        : t("ui.unlearnedSpecialization")}
    </span>
    <div>
      <IconButton
        type="button"
        aria-label={t(`ui.changeSpecialization`)}
        disabled={character_class?.name === PlayerClassType.Adventurer || !edit}
        onclick={() => (openSpec = !openSpec)}
        style={"height: 36px; width: 36px"}
      >
        <WarcraftIcon
          src={gameVersionFactory.iconProvider.getFromSource(
            getSpecIcon().icon ?? ICON_QUESTIONMARK
          )}
          label={t(`ui.changeSpecialization`)}
          grayscale={character_class?.name === PlayerClassType.Adventurer}
        />
      </IconButton>
      <Menu bind:open={openSpec}>
        <List>
          {#each class_specs as _spec}
            <Item
              onclick={() => {
                specialization.name = _spec.name;
              }}
              style={specialization.name === _spec.name
                ? "background-color: var(--palette-success-dark);"
                : ""}
            >
              <WarcraftIcon
                src={gameVersionFactory.iconProvider.getFromSource(_spec.icon)}
                label={`spec.${_spec.name}`}
              />
              <Text style={`margin: 20px; color: ${character_class?.colour}`}
                >{t(`spec.${_spec.name}`)}</Text
              >
            </Item>
          {/each}
        </List>
      </Menu>
    </div>
    {#if ["classic", "tbc", "wotlk", "cata"].includes(gameVersionFactory.gameVersion.getName())}
      <span style="display: flex; align-content: end; justify-content:end;"
        >{getSpentPoints(specialization.talents)}/{getMaxTalentPoints(
          gameVersionFactory.gameVersion.getName(),
          level
        )}
        {t("ui.characterSpentPoints")}</span
      >
    {/if}
  </div>
  {#if edit}
    <button
      type="button"
      style="height: 34px; border: 1px solid black; background: var(--palette-secondary-light); cursor: pointer; width: fit-content; align-self: center"
      onclick={() => handleReset()}>{t(`ui.reset`)}</button
    >
  {/if}
  {#if Object.keys(talents ?? []).length !== 0}
    {#if gameVersionFactory.gameVersion.getName() === "mop"}
      {#each [15, 30, 45, 60, 75, 90] as tier (tier)}
        <TalentFrameRow
          talents={talents[tier as TalentLevel]}
          row={tier}
          active_talent={specialization.talents?.find((talent: TalentType) =>
            talents[tier as TalentLevel]?.find(
              (_talent) => _talent.id === talent.id
            )
          )}
          inactive={tier <= level}
          {edit}
          onUpdate={updateActiveTalent}
        ></TalentFrameRow>
      {/each}
    {:else}
      <TalentTreeFrame
        talents={talents?.talent_tree}
        character_talents={specialization?.talents}
        {character_class}
        character_specialization={specialization?.name}
        {level}
        {edit}
        onUpdate={updateActiveCell}
      ></TalentTreeFrame>
    {/if}
  {/if}
</div>

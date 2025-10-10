<script lang="ts">
  import type { CharacterStatistic } from "$lib/types";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import StatFrame from "./StatFrame.svelte";
  import { t } from "i18next";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  const { statistics } = $props<{
    statistics: CharacterStatistic;
  }>();
</script>

<div
  style="background-color: #111111; border: 1px solid black; padding: 20px; min-height: 400px"
>
  <div style="display: flex; justify-content: space-between;">
    <div style="display: flex; flex-direction: column;">
      <StatFrame
        stat={statistics.health ? statistics.health : "0"}
        statName={"health"}
      />
      <StatFrame
        stat={statistics.power ? statistics.power : "0"}
        statName={statistics.power_type.toLowerCase()}
      />
      <br />
      <StatFrame
        stat={statistics.strength ? statistics.strength : "0"}
        statName={"strength"}
      />
      <StatFrame
        stat={statistics.agility ? statistics.agility : "0"}
        statName={"agility"}
      />
      <StatFrame
        stat={statistics.stamina ? statistics.stamina : "0"}
        statName={"stamina"}
      />
      <StatFrame
        stat={statistics.intellect ? statistics.intellect : "0"}
        statName={"intellect"}
      />
      <StatFrame
        stat={statistics.spirit ? statistics.spirit : "0"}
        statName={"spirit"}
      />
      <br />
      {#if ["classic", "tbc", "wotlk"].includes(gameVersionFactory.gameVersion.getName())}
        <div style="display: flex; align-items: center;">
          <img
            src="/image/resistance/resist_arcane.png"
            style="height: fit-content; width: fit-content; margin-right: 5px"
            alt={t(`character.arcane_resistance`)}
          />
          <StatFrame
            stat={statistics.arcane_resistance
              ? statistics.arcane_resistance
              : "0"}
            statName={"arcane_resistance"}
          />
        </div>

        <div style="display: flex; align-items: center;">
          <img
            src="/image/resistance/resist_fire.png"
            style="height: fit-content; width: fit-content; margin-right: 5px"
            alt={t(`character.fire_resistance`)}
          />
          <StatFrame
            stat={statistics.fire_resistance ? statistics.fire_resistance : "0"}
            statName={"fire_resistance"}
          />
        </div>

        <div style="display: flex; align-items: center;">
          <img
            src="/image/resistance/resist_holy.png"
            style="height: fit-content; width: fit-content; margin-right: 5px"
            alt={t(`character.holy_resistance`)}
          />
          <StatFrame
            stat={statistics.holy_resistance ? statistics.holy_resistance : "0"}
            statName={"holy_resistance"}
          />
        </div>

        <div style="display: flex; align-items: center;">
          <img
            src="/image/resistance/resist_nature.png"
            style="height: fit-content; width: fit-content; margin-right: 5px"
            alt={t(`character.nature_resistance`)}
          />
          <StatFrame
            stat={statistics.nature_resistance
              ? statistics.nature_resistance
              : "0"}
            statName={"nature_resistance"}
          />
        </div>

        <div style="display: flex; align-items: center;">
          <img
            src="/image/resistance/resist_shadow.png"
            style="height: fit-content; width: fit-content; margin-right: 5px"
            alt={t(`character.shadow_resistance`)}
          />
          <StatFrame
            stat={statistics.shadow_resistance
              ? statistics.shadow_resistance
              : "0"}
            statName={"shadow_resistance"}
          />
        </div>

        <div style="display: flex; align-items: center;">
          <img
            src="/image/resistance/resist_frost.png"
            style="height: fit-content; width: fit-content; margin-right: 5px"
            alt={t(`character.frost_resistance`)}
          />
          <StatFrame
            stat={statistics.frost_resistance
              ? statistics.frost_resistance
              : "0"}
            statName={"frost_resistance"}
          />
        </div>
      {/if}
    </div>
    <div style="display: flex; flex-direction: column; align-items: end">
      <StatFrame
        stat={statistics.spell_power ? statistics.spell_power : "0"}
        statName={"spell_power"}
      />
      <StatFrame
        stat={statistics.attack_power ? statistics.attack_power : "0"}
        statName={"attack_power"}
      />
      <StatFrame
        stat={statistics.armor ? statistics.armor : "0"}
        statName={"armor"}
      />
      {#if ["classic", "tbc", "wotlk"].includes(gameVersionFactory.gameVersion.getName())}
        <StatFrame
          stat={statistics.defense ? statistics.defense : "0"}
          statName={"defense"}
        />
        <StatFrame
          stat={statistics.mana_regen ? statistics.mana_regen : "0"}
          statName={"mana_regen"}
        />
      {/if}
      <StatFrame stat={statistics.parry} statName={"parry"} />
      <StatFrame stat={statistics.dodge} statName={"dodge"} />
      <StatFrame stat={statistics.block} statName={"block"} />
      <br />
      <StatFrame stat={statistics.melee_crit} statName={"melee_crit"} />
      <StatFrame stat={statistics.ranged_crit} statName={"ranged_crit"} />
      <StatFrame stat={statistics.spell_crit} statName={"spell_crit"} />
      {#if !["classic"].includes(gameVersionFactory.gameVersion.getName())}
        <StatFrame stat={statistics.melee_haste} statName={"melee_haste"} />
        <StatFrame stat={statistics.ranged_haste} statName={"ranged_haste"} />
        <StatFrame stat={statistics.spell_haste} statName={"spell_haste"} />
      {/if}
      {#if !["classic", "tbc", "wotlk"].includes(gameVersionFactory.gameVersion.getName())}
        <StatFrame stat={statistics.mastery} statName={"mastery"} />
      {/if}
    </div>
  </div>
</div>

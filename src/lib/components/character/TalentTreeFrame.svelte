<script lang="ts">
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import type {
    TalentTreeCell,
    TalentTreeRow,
  } from "$lib/versions/GameVersionTypes";
  import { Content } from "@smui/paper";
  import { t } from "$lib/i18n/index.svelte";
  import type { PlayerClass } from "$lib/consts";
  import TalentTreeCellFrame from "./TalentTreeCellFrame.svelte";
  import type { Talent } from "$lib/types";
  import TalentArrow from "../talent/TalentArrow.svelte";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  const { talents, character_class, character_talents } = $props<{
    talents: TalentTreeRow | null;
    character_class: PlayerClass;
    character_talents: Talent;
  }>();

  function generateTree(talents: TalentTreeCell[]) {
    const items: TalentTreeCell[] = Array.from(
      { length: 7 * 4 },
      () => ({}) as TalentTreeCell
    );
    talents.forEach((talent: TalentTreeCell) => {
      let cells = talent.cell?.split(",") ?? [];
      items[Number(cells[0]) * 4 + Number(cells[1])] = talent;
    });

    return items;
  }
  function findTalentRank(currentTalent: TalentTreeCell) {
    const found = character_talents.find((ctalent: Talent) =>
      currentTalent.ranks.includes(ctalent.id)
    );
    
    if (found) {
      return currentTalent.ranks.indexOf(found.id) + 1;
    }
    return 0;
  }

  function isConnectionActive(currentTalent: TalentTreeCell, tree: number){
    if (currentTalent.connection) {
      const connection_id : TalentTreeCell = talents[tree]?.find(
        (_talent: TalentTreeCell) => _talent.cell === currentTalent.connection
      );
      if (connection_id) {
        
        return findTalentRank(connection_id) > 0;
      }
    }
    return false;
  }

  function getSpentPoints(tree: TalentTreeCell[]) {
    const totalTreeRank = tree.reduce((total, cell) => {
      const cellRank = character_talents
        .filter((ctalent: Talent) => cell.ranks.includes(ctalent.id))
        .map((ctalent: Talent) => ctalent.rank)
        .reduce((sum: number, rank: number) => sum + rank, 0);

      return total + cellRank;
    }, 0);

    return totalTreeRank;
  }
</script>

{#if character_talents}
  <div style="display: flex; justify-content: space-between; width: 100%;">
    <Content
      style="width: 30%; border: 1px solid black; padding: 10px; height: 400px"
    >
      <div style="display: flex; justify-content: center;">
        {t(`game.specs.${character_class}${talents.names?.at(0)}`)} : {getSpentPoints(
          talents[1]
        )}
      </div>

      <div class="tree-wrapper">
        <div class="arrow-overlay">
          {#each talents[1] as talent}
            {#if talent.connection}
              <TalentArrow
                startCell={talent.cell}
                endCell={talent.connection}
                isSet={isConnectionActive(talent, 1)}
              />
            {/if}
          {/each}

          <div class="talent-grid">
            {#each generateTree(talents[1]) as talent}
              <div class="cell">
                {#if talent.name}
                  <TalentTreeCellFrame {talent} rank={findTalentRank(talent)}
                  ></TalentTreeCellFrame>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </Content>
    <Content style="width: 30%; border: 1px solid black; padding: 10px">
      <div style="display: flex; justify-content: center; margin-bottom: 8px">
        {t(`game.specs.${character_class}${talents.names?.at(1)}`)}
        {getSpentPoints(talents[2])}
      </div>
      <div class="tree-wrapper">
        <div class="arrow-overlay">
          {#each talents[2] as talent}
            {#if talent.connection}
              <TalentArrow
                startCell={talent.cell}
                endCell={talent.connection}
                isSet={isConnectionActive(talent, 2)}
              />
            {/if}
          {/each}

          <div class="talent-grid">
            {#each generateTree(talents[2]) as talent}
              <div class="cell">
                {#if talent.name}
                  <TalentTreeCellFrame {talent} rank={findTalentRank(talent)}
                  ></TalentTreeCellFrame>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </Content>
    <Content style="width: 30%; border: 1px solid black; padding: 10px">
      <div style="display: flex; justify-content: center; margin-bottom: 8px">
        {t(`game.specs.${character_class}${talents.names?.at(2)}`)}
        {getSpentPoints(talents[3])}
      </div>
      <div class="tree-wrapper">
        <div class="arrow-overlay">
          {#each talents[3] as talent}
            {#if talent.connection}
              <TalentArrow
                startCell={talent.cell}
                endCell={talent.connection}
                isSet={isConnectionActive(talent, 3)}
              />
            {/if}
          {/each}

          <div class="talent-grid">
            {#each generateTree(talents[3]) as talent}
              <div class="cell">
                {#if talent.name}
                  <TalentTreeCellFrame {talent} rank={findTalentRank(talent)}
                  ></TalentTreeCellFrame>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </Content>
  </div>
{/if}

<style>
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
  }

  .tree-wrapper {
    position: relative;
    width: 100%;
    z-index: 0;
  }

  .talent-grid {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(4, 32px);
    grid-template-rows: repeat(7, 32px);
    gap: 20px;
    position: relative;

    z-index: 1;
  }

  .arrow-overlay {
    position: absolute;
    top: 20px;
    width: calc(4 * 32px + 3 * 20px);
    height: calc(7 * 32px + 6 * 20px);
    margin: 0 auto;
    left: 40px;
    right: 0;
    z-index: 0;
  }
</style>

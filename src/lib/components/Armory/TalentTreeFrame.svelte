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
  import type { CharacterSpec, Talent } from "$lib/types";
  import TalentArrow from "$lib/components/Talent/TalentArrow.svelte";
  import { getMaxTalentPoints, getSpentPoints } from "$lib/helper/talents";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let {
    talents,
    character_class,
    character_specialization,
    character_talents = [],
    edit = false,
    level = 1,
    onUpdate,
  } = $props<{
    talents: TalentTreeRow | null;
    character_class: PlayerClass;
    character_specialization: CharacterSpec;
    character_talents: Talent[];
    edit: boolean;
    level: number;
    onUpdate: (talents: Talent[]) => void;
  }>();

  const versionRows = {
    classic: 7,
    tbc: 9,
    wotlk: 11,
    cata: 7,
    mop: 0,
    wod: 0,
  };

  let trees = $state([
    generateTree(talents[1]),
    generateTree(talents[2]),
    generateTree(talents[3]),
  ]);

  let active_spec_tree = $state(
    Object.entries(talents.names).find(
      (name) =>
        name[1] === character_specialization?.replace(character_class, "")
    ) ?? [2, ""]
  );

  $effect(() => {
    trees = [
      generateTree(talents[1]),
      generateTree(talents[2]),
      generateTree(talents[3]),
    ];
    active_spec_tree = Object.entries(talents.names).find(
      (name) =>
        name[1] === character_specialization?.replace(character_class, "")
    ) ?? [2, ""];
  });

  function generateTree(talents: TalentTreeCell[]) {
    const items: TalentTreeCell[] = Array.from(
      { length: versionRows[gameVersionFactory.gameVersion.getName()] * 4 },
      () => ({}) as TalentTreeCell
    );
    talents.forEach((talent: TalentTreeCell) => {
      let cells = talent.cell?.split(",") ?? [];
      items[Number(cells[0]) * 4 + Number(cells[1])] = talent;
    });

    return items ?? [];
  }
  function findTalentRank(currentTalent: TalentTreeCell) {
    const found = character_talents?.find((ctalent: Talent) =>
      currentTalent.ranks.includes(ctalent.id)
    );
    if (found) {
      return found.rank;
    }
    return 0;
  }

  function isConnectionActive(connection: string, tree: number) {
    if (connection) {
      const connection_id: TalentTreeCell = talents[tree]?.find(
        (_talent: TalentTreeCell) => _talent.cell === connection
      );
      if (connection_id) {
        return (
          findTalentRank(connection_id) ===
          connection_id.ranks.indexOf(
            connection_id.ranks[connection_id.ranks.length - 1]
          ) +
            1
        );
      }
    }
    return false;
  }

  function getSpentTreePoints(
    tree: TalentTreeCell[]
  ): [number, { [k: number]: any }] {
    const pointsPerRow: { [k: number]: any } = {};
    for (
      let index = 0;
      index < versionRows[gameVersionFactory.gameVersion.getName()];
      index++
    ) {
      pointsPerRow[index] = 0;
    }

    tree.map((cell) => {
      const cellRank = character_talents
        .filter((ctalent: Talent) => cell.ranks.includes(ctalent.id))
        .map((ctalent: Talent) => ctalent.rank)
        .reduce((sum: number, rank: number) => sum + rank, 0);
      pointsPerRow[Number(cell.cell?.split(",")[0])] += cellRank;

      return cellRank;
    });

    return [
      Object.values(pointsPerRow).reduce((a, b) => a + b, 0),
      pointsPerRow,
    ];
  }

  function getCellUnlocked(
    cell: TalentTreeCell,
    tree: number,
    learn: boolean,
    current_rank: number
  ) {
    
    if (learn && gameVersionFactory.gameVersion.getName() === "cata") {
      if (character_specialization === "") {
        return false;
      }
      // Cannot learn talent in other specialization if main specialization has less than 31 points
      if (
        tree !== Number(active_spec_tree[0]) + 1 &&
        getSpentTreePoints(talents[Number(active_spec_tree[0]) + 1])[0] < 31
      ) {
        return false;
      }
    }
    // Cannot learn new talents if spent points are at max
    if (
      learn &&
      getSpentPoints(character_talents) ===
        getMaxTalentPoints(gameVersionFactory.gameVersion.getName(), level)
    ) {
      return false;
    }
    const row: number = Number(cell.cell?.split(",")[0]) ?? 0;
    const spentPoints = getSpentTreePoints(talents[tree]);
    spentPoints[1][row] = spentPoints[1][row] -1
    const requiredPoints = row * 5;
    const maxTalent = character_talents
      .map((ctalent: Talent) => {
        const found = talents[tree].find((ttalent: TalentTreeCell) =>
          ttalent.ranks.includes(ctalent.id)
        );
        if (found) {
          return [ctalent.rank, Number(found.cell.split(",")[0])];
        }
        return [-1, -1];
      })
      .reduce(
        (a: [number, number], b: [number, number]) => (a[1] > b[1] ? a : b),
        0
      );

    if (!learn) {
      // Can unlearn if current talent is in the highest row
      if (maxTalent[1] === row) {
        return true;
      }

      // Cannot unlearn if any row has less than required points in total
      const maxRow : number = Number(Object.keys(spentPoints[1])[Object.keys(spentPoints[1]).length-1])
      for (let index = 0; index <= Math.min(maxTalent[1], maxRow); index++) {
        
        const newPointsTotal = Object.values(spentPoints[1]).slice(0, index).reduce((a,b) => a + b,0);
        if (Math.max(0,newPointsTotal)  < index * 5) {
          return false
        }
      }
      

      const found_connection = talents[tree].find((ct: TalentTreeCell) =>
        ct.required.includes(cell.cell ?? "")
      );
      if (found_connection) {
        const out = character_talents.filter((ct: Talent) => {
          return found_connection.ranks.includes(ct.id);
        });
        if (out && out.length > 0) {
          // Cannot unlearn if current talent has an active connection
          if (out.some((e: Talent) => e.rank > 0)) {
            return false;
          }
        }
      }
    } else {
      if (requiredPoints > spentPoints[0]) {
        return false;
      }

      if (cell.required.length > 0) {
        if (isConnectionActive(cell.required[0], tree)) {
          return requiredPoints <= spentPoints[0];
        } else {
          return false;
        }
      }
    }
    return true;
  }

  function handleCellClick(
    e: PointerEvent,
    cell: TalentTreeCell,
    tree: number
  ) {
    const found: Talent = character_talents?.find((ctalent: Talent) =>
      cell.ranks.includes(ctalent.id)
    );
    if (!found) {
      if (getCellUnlocked(cell, tree, e.type === "click" ? true : false, 0)) {
        if (e.type === "click") {
          character_talents.push({
            icon: cell.icon,
            name: cell.name,
            id: cell.ranks[0],
            rank: 1,
          });
        }
      }
    } else {
      if (
        getCellUnlocked(
          cell,
          tree,
          e.type === "click" ? true : false,
          found.rank
        )
      ) {
        if (e.type === "click" && found.rank !== cell.ranks.length) {
          found.id = cell.ranks[found.rank];
          found.rank += 1;
        } else if (e.type === "contextmenu") {
          if (found.rank - 1 !== 0) {
            found.rank -= 1;
            found.id = cell.ranks[found.rank];
          } else {
            const filtered = character_talents.filter((e: Talent) => {
              return e.id !== found.id;
            });
            onUpdate(filtered);
          }
        }
      }
    }
  }
</script>

{#if talents}
  <div style="display: flex; justify-content: space-between; width: 100%;">
    <Content
      style="width: 30%; border: 1px solid black; padding: 10px; height: {versionRows[
        gameVersionFactory.gameVersion.getName()
      ] *
        52 +
        30}px;"
    >
      <div style="display: flex; justify-content: center;">
        {t(`specs.${character_class}${talents.names?.at(0)}`)} ({getSpentTreePoints(
          talents[1] ?? []
        )[0]})
      </div>

      <div class="tree-wrapper">
        <div class="arrow-overlay">
          {#each talents[1] as talent (talent.name)}
            <div id={`${talent.name}-${talents.names?.at(0)}`}>
              {#if talent.required.length > 0}
                {#each talent.required as required ((talent.name, talent.required))}
                  <div id={`${talent.name}-${talents.names?.at(0)}`}>
                    <TalentArrow
                      startCell={required}
                      endCell={talent.cell}
                      isSet={isConnectionActive(required, 1) &&
                        findTalentRank(talent) > 0}
                    />
                  </div>
                {/each}
              {/if}
            </div>
          {/each}

          <div class="talent-grid">
            {#each trees[0] as talent}
              <div class="cell" id={`${talent.name}-${talents.names?.at(0)}`}>
                {#if talent.name}
                  <TalentTreeCellFrame
                    {talent}
                    rank={findTalentRank(talent)}
                    onClick={handleCellClick}
                    {edit}
                    tree={1}
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
        {t(`specs.${character_class}${talents.names?.at(1)}`)}
        ({getSpentTreePoints(talents[2])[0]})
      </div>
      <div class="tree-wrapper">
        <div class="arrow-overlay">
          {#each talents[2] as talent}
            <div id={`${talent.name}-${talents.names?.at(1)}`}>
              {#if talent.required.length > 0}
                {#each talent.required as required}
                  <TalentArrow
                    startCell={required}
                    endCell={talent.cell}
                    isSet={isConnectionActive(required, 2) &&
                      findTalentRank(talent) > 0}
                  />
                {/each}
              {/if}
            </div>
          {/each}
          <div class="talent-grid">
            {#each trees[1] as talent}
              <div class="cell" id={`${talent.name}-${talents.names?.at(1)}`}>
                {#if talent.name}
                  <TalentTreeCellFrame
                    {talent}
                    rank={findTalentRank(talent)}
                    onClick={handleCellClick}
                    {edit}
                    tree={2}
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
        {t(`specs.${character_class}${talents.names?.at(2)}`)}
        ({getSpentTreePoints(talents[3])[0]})
      </div>
      <div class="tree-wrapper">
        <div class="arrow-overlay">
          {#each talents[3] as talent}
            <div id={`${talent.name}-${talents.names?.at(2)}`}>
              {#if talent.required.length > 0}
                {#each talent.required as required}
                  <div id={`${talent.name}-${talents.names?.at(2)}`}>
                    <TalentArrow
                      startCell={required}
                      endCell={talent.cell}
                      isSet={isConnectionActive(required, 3) &&
                        findTalentRank(talent) > 0}
                    />
                  </div>
                {/each}
              {/if}
            </div>
          {/each}

          <div class="talent-grid">
            {#each trees[2] as talent}
              <div class="cell" id={`${talent.name}-${talents.names?.at(2)}`}>
                {#if talent.name}
                  <TalentTreeCellFrame
                    {talent}
                    rank={findTalentRank(talent)}
                    onClick={handleCellClick}
                    {edit}
                    tree={3}
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
    margin-left: -16px;
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

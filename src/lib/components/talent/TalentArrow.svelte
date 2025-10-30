<script lang="ts">
  import { v4 } from "uuid";
  const { startCell, endCell, isSet } = $props<{
    startCell: string;
    endCell: string;
    isSet: boolean;
  }>();

  const CELL_SIZE = 32;
  const GAP = 20;
  const STEP = CELL_SIZE + GAP;

  const asset = (type: string) =>
    `/image/talent/${type}_${isSet ? "set" : "unset"}.png`;

  interface Segment {
    type: string;
    top: number;
    left: number;
    style?: string;
  }

  function generateRoute(
    start: [number, number],
    end: [number, number]
  ): Segment[] {
    const route: Segment[] = [];

    let [row, col] = start;
    const [targetRow, targetCol] = end;

    const rowDiff = targetRow - row;
    const colDiff = targetCol - col;

    const horizontalDir = colDiff > 0 ? 1 : -1;
    const verticalDir = rowDiff > 0 ? 1 : -1;

    for (let i = 0; i < Math.abs(colDiff); i++) {
      route.push({
        type: "line_horizontal",
        top: row * STEP,
        left: horizontalDir > 0 ? col * STEP : GAP,
      });
      col += horizontalDir;
    }

    if (colDiff !== 0 && rowDiff !== 0) {
      route.push({
        type: horizontalDir > 0 ? "line_left_down" : "line_right_down",
        top: row * STEP,
        left: col * STEP,
      });
      row += verticalDir;
      if (route[route.length - 2]?.type === "line_horizontal") {
        route[route.length - 2].style = "width: 54px;";
      }
    }

    for (let i = 0; i < Math.abs(rowDiff); i++) {
      route.push({
        type: "line_vertical",
        top: row * STEP,
        left: col * STEP,
      });
      if (
        ["line_left_down", "line_right_down"].includes(
          route[route.length - 2]?.type
        ) ||
        route[route.length - 2]?.style?.includes("margin-top")
      ) {
        route[route.length - 1].style = "margin-top: -23px;";
        if (i + 1 == Math.abs(rowDiff)) {
          route[route.length - 1].style = "height: 20px; margin-top: -23px";
        }
      }
      row += verticalDir;
    }

    const arrowType =
      rowDiff > 0
        ? "arrow_down"
        : horizontalDir > 0
          ? "arrow_right"
          : "arrow_left";

    route.push({
      type: arrowType,
      top: row * STEP,
      left: col * STEP,
    });

    if (
      ["line_left_down", "line_right_down"].includes(
        route[route.length - 2]?.type
      ) ||
      route[route.length - 2]?.style?.includes("margin-top")
    ) {
      route[route.length - 1].style = "margin-top: -73px;";
    }
    return route;
  }

  let start_cell = startCell.split(",").map(Number) as [number, number];
  let end_cell = endCell.split(",").map(Number) as [number, number];
  let routes = $state(generateRoute(start_cell, end_cell));
</script>

{#each routes as seg}
  <div id={`${v4()}`}>
    <img
      src={asset(seg.type)}
      alt={seg.type}
      class="arrow-segment {seg.type}"
      style="top: {seg.top}px; left: {seg.left}px; {seg.style}"
      id={`${v4()}`}
    />
  </div>
{/each}

<style>
  .arrow-segment {
    position: absolute;
    width: 32px;
    height: 32px;
    pointer-events: none;
  }

  .arrow-segment.line_vertical {
    height: 52px;
  }

  .arrow-segment.line_horizontal {
    width: 52px;
    margin-top: -3px;
  }

  .arrow-segment.line_left_down {
    margin-top: -3px;
  }

  .arrow-segment.line_right_down {
    margin-top: -3px;
  }

  .arrow-segment.arrow_down {
    margin-top: -21px;
    z-index: 2;
  }

  .arrow-segment.arrow_right {
    margin-left: -18px;
    margin-top: -3px;
    z-index: 2;
  }

  .arrow-segment.arrow_left {
    margin-left: 18px;
    margin-top: -3px;
    z-index: 2;
  }
</style>

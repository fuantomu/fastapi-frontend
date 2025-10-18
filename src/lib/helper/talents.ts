import type { Talent } from "$lib/types";

export function getMaxTalentPoints(version: string, level: number) {
    if (!level){
        return 0
    }
    if (version === "cata") {

        if ([10, 11].includes(level)) {
            return level - 9
        }
        else if (level > 10 && level < 81) {
            return Math.floor((level - 11) / 2) + 2
        }
        else if (level > 80) {
            return Math.floor((Math.min(level,79) - 11) / 2) + 2 + (level - 80)
        }
        return 0

    }
    else {
        return Math.max(0, level - 9);
    }
}

export function getSpentPoints(talents: Talent[]) {
    const result = talents?.map(
      (talent: Talent) => talent.rank
    );
    return result?.reduce((sum: number, e: number) => sum + e, 0) ?? 0;
  }
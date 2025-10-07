import type { GameVersionType } from "$lib/versions/GameVersionTypes";
import { versionType as PreviousVersionType } from "$lib/versions/mop/GameVersionType"


export const versionType: GameVersionType = {
    classes: [...PreviousVersionType.classes
    ],
    specs: [...PreviousVersionType.specs
    ],
    races: [...PreviousVersionType.races
    ],
    raceClasses: [...PreviousVersionType.raceClasses],
    factionRaces: [...PreviousVersionType.factionRaces]
};
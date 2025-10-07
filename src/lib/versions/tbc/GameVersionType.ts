import type { GameVersionType } from "$lib/versions/GameVersionTypes";
import { versionType as PreviousVersionType } from "$lib/versions/classic/GameVersionType"

export const versionType: GameVersionType = {
    classes: [...PreviousVersionType.classes
    ],
    specs: [...PreviousVersionType.specs
    ],
    races: [
        ...PreviousVersionType.races,
        {
            name: "Bloodelf",
            icon_male: "race_blood-elf_male",
            icon_female: "race_blood-elf_female",
        },
        {
            name: "Draenei",
            icon_male: "race_draenei_male",
            icon_female: "race_draenei_female",
        }
    ],
    raceClasses: [
        ...PreviousVersionType.raceClasses,
        {
            race: "Bloodelf",
            class: "Hunter"
        },
        {
            race: "Bloodelf",
            class: "Mage"
        },
        {
            race: "Bloodelf",
            class: "Paladin"
        },
        {
            race: "Bloodelf",
            class: "Priest"
        },
        {
            race: "Bloodelf",
            class: "Rogue"
        },
        {
            race: "Bloodelf",
            class: "Warlock"
        },
        {
            race: "Draenei",
            class: "Hunter"
        },
        {
            race: "Draenei",
            class: "Mage"
        },
        {
            race: "Draenei",
            class: "Paladin"
        },
        {
            race: "Draenei",
            class: "Priest"
        },
        {
            race: "Draenei",
            class: "Shaman"
        },
        {
            race: "Draenei",
            class: "Warrior"
        }],

    factionRaces: [
        ...PreviousVersionType.factionRaces, {
            faction: "Horde",
            race: "Bloodelf"
        }, {
            faction: "Alliance",
            race: "Draenei"
        }],
    maxLevel: 70
};
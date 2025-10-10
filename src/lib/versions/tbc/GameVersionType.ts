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
    maxLevel: 70,
    talents: {
        druid: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        deathknight: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        rogue: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        paladin: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        priest: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        warlock: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        warrior: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        shaman: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        hunter: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        mage: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        },
        monk: {
            15: null,
            30: null,
            45: null,
            60: null,
            75: null,
            90: null,
            rows: []
        }
    }
};
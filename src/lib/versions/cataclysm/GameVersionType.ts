import type { GameVersionType } from "$lib/versions/GameVersionTypes";
import { versionType as PreviousVersionType } from "$lib/versions/wotlk/GameVersionType"

export const versionType: GameVersionType = {
    classes: [...PreviousVersionType.classes
    ],
    specs: [...PreviousVersionType.specs
    ],
    races: [
        ...PreviousVersionType.races,
        {
            name: "Goblin",
            icon_male: "achievement_goblinhead",
            icon_female: "achievement_femalegoblinhead",
        },
        {
            name: "Worgen",
            icon_male: "achievement_worganhead",
            icon_female: "race_worgen_female",
        }
    ],
    raceClasses: [
        ...PreviousVersionType.raceClasses,
        {
            race: "Worgen",
            class: "Deathknight"
        }, {
            race: "Worgen",
            class: "Druid"
        }, {
            race: "Worgen",
            class: "Hunter"
        }, {
            race: "Worgen",
            class: "Mage"
        }, {
            race: "Worgen",
            class: "Priest"
        }, {
            race: "Worgen",
            class: "Rogue"
        }, {
            race: "Worgen",
            class: "Warlock"
        }, {
            race: "Worgen",
            class: "Warrior"
        }, {
            race: "Goblin",
            class: "Deathknight"
        }, {
            race: "Goblin",
            class: "Hunter"
        }, {
            race: "Goblin",
            class: "Mage"
        }, {
            race: "Goblin",
            class: "Priest"
        }, {
            race: "Goblin",
            class: "Rogue"
        }, {
            race: "Goblin",
            class: "Shaman"
        }, {
            race: "Goblin",
            class: "Warlock"
        }, {
            race: "Goblin",
            class: "Warrior"
        }, {
            race: "Human",
            class: "Hunter"
        }, {
            race: "Dwarf",
            class: "Mage"
        }, {
            race: "Dwarf",
            class: "Shaman"
        }, {
            race: "Dwarf",
            class: "Warlock"
        }, {
            race: "Nightelf",
            class: "Mage"
        }, {
            race: "Gnome",
            class: "Priest"
        }, {
            race: "Orc",
            class: "Mage"
        }, {
            race: "Undead",
            class: "Hunter"
        }, {
            race: "Tauren",
            class: "Paladin"
        }, {
            race: "Tauren",
            class: "Priest"
        }, {
            race: "Troll",
            class: "Druid"
        }, {
            race: "Troll",
            class: "Warlock"
        }, {
            race: "Bloodelf",
            class: "Warrior"
        }],
    factionRaces: [
        ...PreviousVersionType.factionRaces, {
            faction: "Horde",
            race: "Goblin"
        }, {
            faction: "Alliance",
            race: "Worgen"
        }]
};
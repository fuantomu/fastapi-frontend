import type { GameVersionType } from "$lib/versions/GameVersionTypes";
import { versionType as PreviousVersionType } from "$lib/versions/cataclysm/GameVersionType"

export const versionType: GameVersionType = {
    classes: [
        ...PreviousVersionType.classes,
        {
            name: "Monk",
            icon: "classicon_monk",
        }
    ],
    specs: [
        ...PreviousVersionType.specs,
        {
            name: "MonkBrewmaster",
            icon: "spell_monk_brewmaster_spec",
            class: "Monk"
        },
        {
            name: "MonkWindwalker",
            icon: "spell_monk_windwalker_spec",
            class: "Monk"
        },
        {
            name: "MonkMistweaver",
            icon: "spell_monk_mistweaver_spec",
            class: "Monk"
        }
    ],
    races: [
        ...PreviousVersionType.races,
        {
            name: "Pandaren",
            icon_male: "race_pandaren_male",
            //icon_female: "race_pandaren_female", Currently bugged from Blizzard API. Returns the male Pandaren icon
            icon_female: "achievement_character_pandaren_female"
        }
    ],
    raceClasses: [
        ...PreviousVersionType.raceClasses, {
            race: "Pandaren",
            class: "Monk"
        }, {
            race: "Pandaren",
            class: "Hunter"
        }, {
            race: "Pandaren",
            class: "Mage"
        }, {
            race: "Pandaren",
            class: "Priest"
        }, {
            race: "Pandaren",
            class: "Rogue"
        }, {
            race: "Pandaren",
            class: "Shaman"
        }, {
            race: "Pandaren",
            class: "Warrior"
        }, {
            race: "Human",
            class: "Monk"
        }, {
            race: "Dwarf",
            class: "Monk"
        }, {
            race: "Nightelf",
            class: "Monk"
        }, {
            race: "Gnome",
            class: "Monk"
        }, {
            race: "Draenei",
            class: "Monk"
        }, {
            race: "Worgen",
            class: "Monk"
        }, {
            race: "Orc",
            class: "Monk"
        }, {
            race: "Troll",
            class: "Monk"
        }, {
            race: "Tauren",
            class: "Monk"
        }, {
            race: "Undead",
            class: "Monk"
        }, {
            race: "Bloodelf",
            class: "Monk"
        }, {
            race: "Goblin",
            class: "Monk"
        }],
    factionRaces: [
        ...PreviousVersionType.factionRaces, {
            faction: "Horde",
            race: "Pandaren"
        }, {
            faction: "Alliance",
            race: "Pandaren"
        }],
    maxLevel: 90
};
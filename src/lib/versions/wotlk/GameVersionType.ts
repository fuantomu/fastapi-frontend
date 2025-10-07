import type { GameVersionType } from "$lib/versions/GameVersionTypes";
import { versionType as PreviousVersionType } from "$lib/versions/tbc/GameVersionType"

export const versionType: GameVersionType = {
    classes: [
        ...PreviousVersionType.classes,
        {
            name: "Deathknight",
            icon: "classicon_deathknight",
        }
    ],
    specs: [
        ...PreviousVersionType.specs,
        {
            name: "DeathknightBlood",
            icon: "spell_deathknight_bloodpresence",
            class: "Deathknight"
        },
        {
            name: "DeathknightFrost",
            icon: "spell_deathknight_frostpresence",
            class: "Deathknight"
        },
        {
            name: "DeathknightUnholy",
            icon: "spell_deathknight_unholypresence",
            class: "Deathknight"
        }],
    races: [
        ...PreviousVersionType.races,
    ],
    raceClasses: [
        ...PreviousVersionType.raceClasses,
        {
            race: "Human",
            class: "Deathknight"
        }, {
            race: "Nightelf",
            class: "Deathknight"
        }, {
            race: "Dwarf",
            class: "Deathknight"
        }, {
            race: "Gnome",
            class: "Deathknight"
        }, {
            race: "Draenei",
            class: "Deathknight"
        }, {
            race: "Orc",
            class: "Deathknight"
        }, {
            race: "Troll",
            class: "Deathknight"
        }, {
            race: "Tauren",
            class: "Deathknight"
        }, {
            race: "Undead",
            class: "Deathknight"
        }, {
            race: "Bloodelf",
            class: "Deathknight"
        }
    ],
    factionRaces: [...PreviousVersionType.factionRaces],
    maxLevel: 80
};
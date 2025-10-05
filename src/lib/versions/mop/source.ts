import { ICON_QUESTIONMARK, UNKNOWN_CLASS, UNKNOWN_SPEC } from "$lib/consts";
import type { GameVersionType } from "$lib/versions/GameVersionTypes";

export const versionType: GameVersionType = {
    classes: [
        {
            name: "Monk",
            icon: "classicon_deathknight",
        },
        { name: UNKNOWN_CLASS, icon: ICON_QUESTIONMARK }
    ],
    specs: [
        {
            name: "MonkBrewmaster",
            icon: "spell_deathknight_bloodpresence",
            class: "Monk"
        },
        {
            name: "MonkWindwalker",
            icon: "spell_deathknight_frostpresence",
            class: "Monk"
        },
        {
            name: "MonkMistweaver",
            icon: "spell_deathknight_unholypresence",
            class: "Monk"
        },
        { name: UNKNOWN_SPEC, icon: ICON_QUESTIONMARK, class: UNKNOWN_CLASS }
    ]
};
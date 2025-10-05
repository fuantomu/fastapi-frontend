import { ICON_QUESTIONMARK, UNKNOWN_CLASS, UNKNOWN_SPEC } from "$lib/consts";
import type { GameVersionType } from "$lib/versions/GameVersionTypes";

export const versionType: GameVersionType = {
    classes: [
        { name: UNKNOWN_CLASS, icon: ICON_QUESTIONMARK }
    ],
    specs: [
        { name: UNKNOWN_SPEC, icon: ICON_QUESTIONMARK, class: UNKNOWN_CLASS }
    ]
};
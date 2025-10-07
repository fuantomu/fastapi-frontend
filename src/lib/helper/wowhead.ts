import { GameVersionName } from "$lib/versions/GameVersion";

export const getWowheadLink = (search_type: string, version: string) => {
    switch (version) {
        case GameVersionName.WOD:
            return `https://www.wowhead.com/wod-classic/${search_type}=`
        case GameVersionName.MOP:
            return `https://www.wowhead.com/mop-classic/${search_type}=`
        case GameVersionName.CATACLYSM:
            return `https://www.wowhead.com/cata/${search_type}=`
        case GameVersionName.WOTLK:
            return `https://www.wowhead.com/wotlk/${search_type}=`
        case GameVersionName.TBC:
            return `https://www.wowhead.com/tbc/${search_type}=`
        case GameVersionName.CLASSIC:
            return `https://www.wowhead.com/classic/${search_type}=`
    }
}
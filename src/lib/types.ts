import type { Faction, Gender, PlayerClass, PlayerSpec, Race, RealmVersion, Region } from "./consts";
import type { GameVersionName } from "./versions/GameVersion";

export type Character = {
    id: number;
    name: string;
    gender: Gender;
    faction: Faction;
    race: Race;
    character_class: PlayerClass;
    active_spec: PlayerSpec;
    realm: string;
    guild: number;
    level: number;
    achievement_points: number;
    last_login_timestamp: number;
    equipped_item_level: number;
    active_title: string;
    region: Region;
    version: GameVersionName;
    realm_version: RealmVersion;
};

export type CharacterEquipment = {
    head: CharacterItem | null;
    shoulders: CharacterItem | null;
    neck: CharacterItem | null;
    back: CharacterItem | null;
    chest: CharacterItem | null;
    shirt: CharacterItem | null;
    tabard: CharacterItem | null;
    wrist: CharacterItem | null;
    hands: CharacterItem | null;
    waist: CharacterItem | null;
    legs: CharacterItem | null;
    feet: CharacterItem | null;
    ring_1: CharacterItem | null;
    ring_2: CharacterItem | null;
    trinket_1: CharacterItem | null;
    trinket_2: CharacterItem | null;
    main_hand: CharacterItem | null;
    off_hand: CharacterItem | null;
    ranged: CharacterItem | null;
}

export type CharacterItem = {
    character_id: number;
    id: number;
    name: string;
    slot: string;
    quality: string;
    wowhead_link: string;
    icon: string;
    inventory_type: string;
    enchantment: string;
    version: GameVersionName;
}

export type CharacterSpec = {
    id: number;
    name: string;
    talents: Talent[];
    glyphs: Glyph[];
    spec_id: number;
    version: GameVersionName;
}

export type CharacterStatistic = {
    id: number;
    name: string;
    type: string;
    value: string | RatingModel;
    version: GameVersionName;
}

export type RatingModel = {
    value: number;
    rating: number
}

export type Talent = {
    id: number;
    name: string;
    icon: string;
    rank: number;
}

export type Glyph = {
    id: number;
    name: string;
    icon: string;
    type: string;
    character_class: string;
}

export type Enchantment = {
    id: number;
    name: string;
    display_string: string | null;
    slot: string | null;
    source_id: number | null;
    type: number | null;
}

export type Guild = {
    id: number;
    name: string;
    faction: Faction;
    realm: string;
    achievement_points: number;
    member_count: number;
    created_timestamp: number;
    region: Region,
    version: GameVersionName;
}

export type WCLName = {
    id: number;
    name: string;
    journalID: number | null
}

export type WCLSlug = {
    slug: string;
    name: string | null;
}

export type WCLServer = {
    region: WCLSlug;
} & WCLSlug

export type WCLGuild = {
    server: WCLServer
} & WCLName

export type WCLRank = {
    rank_id : number;
    class: number;
    spec: number;
    per_second_amount: number;
    ilvl: number;
    fight_metadata: number;
}

export type WCLAllStars = {
    partition: number;
    spec: string | null
    points: number | string;
    possiblePoints: number;
    rank: number;
    regionRank: number;
    serverRank: number;
    rankPercent: number | null
    total: number;
    rankTooltip: string | null
}

export type WCLEncounterRanking = {
    encounter: WCLName;
    rankPercent: number | null;
    medianPercent: number | null;
    lockedIn: boolean;
    totalKills: number;
    fastestKill: number;
    allStars: WCLAllStars | null;
    spec: string | null;
    bestSpec : string | null;
    bestAmount: number;
    rankTooltip: string | null;
    bestRank: WCLRank | null;
}

export type WCLZoneRanking = {
    bestPerformanceAverage: number | null;
    medianPerformanceAverage: number | null;
    difficulty: number;
    metric: string;
    partition: number;
    zone: number;
    size: number;
    allStars: [WCLAllStars];
    rankings: [WCLEncounterRanking];
}

export type WCLRanking = {
    name: string
    id: number
    classID: number
    gameData: Object
    faction: WCLName
    level: number
    hidden: string | boolean
    guilds: [WCLGuild]
    guildRank: number
    zoneRankings: WCLZoneRanking
}

export type WCLBracket ={
    min: number
    max: number;
    bucket: number;
    type: string
}

export type WCLDifficulty = {
    sizes: [number]
} & WCLName

export type WCLZone = {
    brackets: WCLBracket | null
    difficulties: [WCLDifficulty]
    encounters: [WCLName]
    expansion: WCLName
    frozen: boolean
    name: string
}

export type EnchantmentState = {
    head: Enchantment[],
    shoulders: Enchantment[],
    neck: Enchantment[],
    chest: Enchantment[],
    shirt: Enchantment[],
    tabard: Enchantment[],
    wrist: Enchantment[],
    hands: Enchantment[],
    waist: Enchantment[],
    legs: Enchantment[],
    feet: Enchantment[],
    ring_1: Enchantment[],
    ring_2: Enchantment[],
    trinket_1: Enchantment[],
    trinket_2: Enchantment[],
    main_hand: Enchantment[],
    off_hand: Enchantment[],
    ranged: Enchantment[],
}
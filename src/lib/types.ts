import type { Faction, Gender, PlayerClass, PlayerSpec, Race, Region } from "./consts";
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
    average_item_level: number;
    equipped_item_level: number;
    active_title: string;
    region: Region;
    version: GameVersionName;
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
    active: boolean;
    version: GameVersionName;
    spent_points: string;
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
}

export type Glyph = {
    id: number;
    name: string;
    icon: string;
    type: string;
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
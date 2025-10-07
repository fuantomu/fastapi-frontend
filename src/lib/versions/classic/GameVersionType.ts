import { ICON_QUESTIONMARK, UNKNOWN_CLASS, UNKNOWN_RACE, UNKNOWN_SPEC } from "$lib/consts";
import type { GameVersionType } from "$lib/versions/GameVersionTypes";

export const versionType: GameVersionType = {
    classes: [
        {
            name: "Warrior",
            icon: "classicon_warrior"
        },
        {
            name: "Rogue",
            icon: "classicon_rogue"
        },
        {
            name: "Paladin",
            icon: "classicon_paladin"
        },
        {
            name: "Mage",
            icon: "classicon_mage"
        },
        {
            name: "Priest",
            icon: "classicon_priest"
        },
        {
            name: "Warlock",
            icon: "classicon_warlock"
        },
        {
            name: "Druid",
            icon: "classicon_druid"
        },
        {
            name: "Shaman",
            icon: "classicon_shaman"
        },
        {
            name: "Hunter",
            icon: "classicon_hunter"
        },
        { name: UNKNOWN_CLASS, icon: ICON_QUESTIONMARK }
    ],
    specs: [
        { name: "DruidBalance", icon: "spell_nature_starfall", class: "Druid" },
        { name: "DruidFeral", icon: "ability_druid_catform", class: "Druid" },
        { name: "DruidGuardian", icon: "ability_racial_bearform", class: "Druid" },
        { name: "DruidRestoration", icon: "spell_nature_healingtouch", class: "Druid" },
        { name: "HunterBeastmastery", icon: "ability_hunter_bestialdiscipline", class: "Hunter" },
        { name: "HunterMarksmanship", icon: "ability_hunter_focusedaim", class: "Hunter" },
        { name: "HunterSurvival", icon: "ability_hunter_camouflage", class: "Hunter" },
        { name: "MageArcane", icon: "spell_holy_magicalsentry", class: "Mage" },
        { name: "MageFire", icon: "spell_fire_firebolt02", class: "Mage" },
        { name: "MageFrost", icon: "spell_frost_frostbolt02", class: "Mage" },
        { name: "PriestDiscipline", icon: "spell_holy_powerwordshield", class: "Priest" },
        { name: "PriestHoly", icon: "spell_holy_guardianspirit", class: "Priest" },
        { name: "PriestShadow", icon: "spell_shadow_shadowwordpain", class: "Priest" },
        { name: "PaladinHoly", icon: "spell_holy_holybolt", class: "Paladin" },
        { name: "PaladinProtection", icon: "ability_paladin_shieldofthetemplar", class: "Paladin" },
        { name: "PaladinRetribution", icon: "spell_holy_auraoflight", class: "Paladin" },
        { name: "RogueAssassination", icon: "ability_rogue_eviscerate", class: "Rogue" },
        { name: "RogueCombat", icon: "ability_backstab", class: "Rogue" },
        { name: "RogueSubtlety", icon: "ability_stealth", class: "Rogue" },
        { name: "WarlockAffliction", icon: "spell_shadow_deathcoil", class: "Warlock" },
        { name: "WarlockDemonology", icon: "spell_shadow_metamorphosis", class: "Warlock" },
        { name: "WarlockDestruction", icon: "spell_shadow_rainoffire", class: "Warlock" },
        { name: "ShamanElemental", icon: "spell_nature_lightning", class: "Shaman" },
        { name: "ShamanEnhancement", icon: "spell_shaman_improvedstormstrike", class: "Shaman" },
        { name: "ShamanRestoration", icon: "spell_nature_magicimmunity", class: "Shaman" },
        { name: "WarriorArms", icon: "ability_warrior_savageblow", class: "Warrior" },
        { name: "WarriorFury", icon: "ability_warrior_innerrage", class: "Warrior" },
        { name: "WarriorProtection", icon: "ability_warrior_defensivestance", class: "Warrior" },
        { name: UNKNOWN_SPEC, icon: ICON_QUESTIONMARK, class: UNKNOWN_CLASS }
    ],
    races: [
        {
            name: "Human",
            icon_male: "race_human_male",
            icon_female: "race_human_female",
        },
        {
            name: "Dwarf",
            icon_male: "race_dwarf_male",
            icon_female: "race_dwarf_female",
        },
        {
            name: "Gnome",
            icon_male: "race_gnome_male",
            icon_female: "race_gnome_female",
        },
        {
            name: "Nightelf",
            icon_male: "race_night-elf_male",
            icon_female: "race_night-elf_female",
        },
        {
            name: "Orc",
            icon_male: "race_orc_male",
            icon_female: "race_orc_female",
        },
        {
            name: "Troll",
            icon_male: "race_troll_male",
            icon_female: "race_troll_female",
        },
        {
            name: "Tauren",
            icon_male: "race_tauren_male",
            icon_female: "race_tauren_female",
        },
        {
            name: "Undead",
            icon_male: "race_undead_male",
            icon_female: "race_undead_female",
        },
        { name: UNKNOWN_RACE, icon_male: ICON_QUESTIONMARK, icon_female: ICON_QUESTIONMARK }
    ],
    raceClasses: [
        { "race": "Dwarf", "class": "Hunter" },
        { "race": "Dwarf", "class": "Paladin" },
        { "race": "Dwarf", "class": "Priest" },
        { "race": "Dwarf", "class": "Rogue" },
        { "race": "Dwarf", "class": "Warrior" },
        { "race": "Gnome", "class": "Mage" },
        { "race": "Gnome", "class": "Rogue" },
        { "race": "Gnome", "class": "Warlock" },
        { "race": "Gnome", "class": "Warrior" },
        { "race": "Human", "class": "Mage" },
        { "race": "Human", "class": "Paladin" },
        { "race": "Human", "class": "Priest" },
        { "race": "Human", "class": "Rogue" },
        { "race": "Human", "class": "Warlock" },
        { "race": "Human", "class": "Warrior" },
        { "race": "Nightelf", "class": "Druid" },
        { "race": "Nightelf", "class": "Hunter" },
        { "race": "Nightelf", "class": "Priest" },
        { "race": "Nightelf", "class": "Rogue" },
        { "race": "Nightelf", "class": "Warrior" },
        { "race": "Orc", "class": "Hunter" },
        { "race": "Orc", "class": "Rogue" },
        { "race": "Orc", "class": "Shaman" },
        { "race": "Orc", "class": "Warlock" },
        { "race": "Orc", "class": "Warrior" },
        { "race": "Tauren", "class": "Druid" },
        { "race": "Tauren", "class": "Hunter" },
        { "race": "Tauren", "class": "Shaman" },
        { "race": "Tauren", "class": "Warrior" },
        { "race": "Troll", "class": "Hunter" },
        { "race": "Troll", "class": "Mage" },
        { "race": "Troll", "class": "Priest" },
        { "race": "Troll", "class": "Rogue" },
        { "race": "Troll", "class": "Shaman" },
        { "race": "Troll", "class": "Warrior" },
        { "race": "Undead", "class": "Mage" },
        { "race": "Undead", "class": "Priest" },
        { "race": "Undead", "class": "Rogue" },
        { "race": "Undead", "class": "Warlock" },
        { "race": "Undead", "class": "Warrior" }],
    factionRaces: [
        {
            faction: "Horde",
            race: "Orc"
        }, {
            faction: "Horde",
            race: "Troll"
        }, {
            faction: "Horde",
            race: "Tauren"
        }, {
            faction: "Horde",
            race: "Undead"
        }, {
            faction: "Alliance",
            race: "Human"
        }, {
            faction: "Alliance",
            race: "Nightelf"
        }, {
            faction: "Alliance",
            race: "Dwarf"
        }, {
            faction: "Alliance",
            race: "Goblin"
        }],
    maxLevel: 60
};
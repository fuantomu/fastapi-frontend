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
    maxLevel: 90,
    talents:
    {
        druid: {
            15: [{
                name: "Feline Swiftness",
                icon: "spell_druid_tirelesspursuit",
                id: "131768",
                cell: null
            }, {
                name: "Displacer Beast",
                icon: "spell_druid_displacement",
                id: "102280",
                cell: null
            }, {
                name: "Wild Charge",
                icon: "spell_druid_wildcharge",
                id: "102401",
                cell: null
            }],
            30: [
                { name: "Ysera's Gift", icon: "inv_misc_head_dragon_green", id: "145108", cell: null },
                { name: "Renewal", icon: "spell_nature_natureblessing", id: "108238", cell: null },
                { name: "Cenarion Ward", icon: "ability_druid_naturalperfection", id: "102351", cell: null }
            ],
            45: [
                { name: "Faerie Swarm", icon: "spell_druid_swarm", id: "106707", cell: null },
                { name: "Mass Entanglement", icon: "spell_druid_massentanglement", id: "102359", cell: null },
                { name: "Typhoon", icon: "ability_druid_typhoon", id: "132469", cell: null }
            ],
            60: [
                { name: "Soul of the Forest", icon: "ability_druid_manatree", id: "114107", cell: null },
                { name: "Incarnation", icon: "spell_druid_incarnation", id: "spell_druid_incarnation", cell: null },
                { name: "Force of Nature", icon: "106737", id: "ability_druid_forceofnature", cell: null }
            ],
            75: [
                { name: "Disorienting Roar", icon: "99", id: "ability_druid_demoralizingroar", cell: null },
                { name: "Ursol's Vortex", icon: "spell_druid_ursolsvortex", id: "102793", cell: null },
                { name: "Mighty Bash", icon: "ability_druid_bash", id: "5211", cell: null }
            ],
            90: [
                { name: "Heart of the Wild", icon: "spell_holy_blessingofagility", id: "108288", cell: null },
                { name: "Dream of Cenarius", icon: "ability_druid_dreamstate", id: "108373", cell: null },
                { name: "Nature's Vigil", icon: "achievement_zone_feralas", id: "124974", cell: null }
            ],
            rows: null
        },
        warrior: {
            15: [{
                name: "",
                icon: "",
                id: "",
                cell: null
            }],
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null
        },
        mage: {
            15: {
                name: "",
                icon: "",
                cell: null
            },
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null

        },
        warlock: {
            15: {
                name: "",
                icon: "",
                cell: null
            },
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null
        },
        monk: {
            15: {
                name: "",
                icon: "",
                cell: null
            },
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null
        },
        paladin: {
            15: [
                { id: 85499, name: "Speed of Light", icon: "ability_paladin_speedoflight", cell: null },
                { id: 87172, name: "Long Arm of the Law", icon: "ability_paladin_longarmofthelaw", cell: null },
                { id: 26023, name: "Pursuit of Justice", icon: "ability_paladin_veneration", cell: null }
            ],
            30: [
                { id: 105593, name: "Fist of Justice", icon: "spell_holy_fistofjustice", cell: null },
                { id: 20066, name: "Repentance", icon: "spell_holy_prayerofhealing", cell: null },
                { id: 110301, name: "Evil is a Point of View", icon: "ability_paladin_turnevil", cell: null }
            ],
            45: [
                { id: 85804, name: "Selfless Healer", icon: "ability_paladin_gaurdedbythelight", cell: null },
                { id: 114163, name: "Eternal Flame", icon: "inv_torch_thrown", cell: null },
                { id: 20925, name: "Sacred Shield", icon: "ability_paladin_blessedmending", cell: null }
            ],
            60: [
                { id: 114039, name: "Hand of Purity", icon: "spell_holy_sealofwisdom", cell: null },
                { id: 114154, name: "Unbreakable Spirit", icon: "spell_holy_unyieldingfaith", cell: null },
                { id: 105622, name: "Clemency", icon: "ability_paladin_clemency", cell: null }
            ],
            75: [
                { id: 105809, name: "Holy Avenger", icon: "ability_paladin_holyavenger", cell: null },
                { id: 53376, name: "Sanctified Wrath", icon: "ability_paladin_sanctifiedwrath", cell: null },
                { id: 86172, name: "Divine Purpose", icon: "spell_holy_divinepurpose", cell: null }
            ],
            90: [
                { id: 114165, name: "Holy Prism", icon: "spell_paladin_holyprism", cell: null },
                { id: 114158, name: "Light's Hammer", icon: "spell_paladin_lightshammer", cell: null },
                { id: 114157, name: "Execution Sentence", icon: "spell_paladin_executionsentence", cell: null }
            ],
            rows: null
        },
        rogue: {
            15: {
                name: "",
                icon: "",
                cell: null
            },
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null
        },
        priest: {
            15: {
                name: "",
                icon: "",
                cell: null
            },
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null
        },
        deathknight: {
            15: {
                name: "",
                icon: "",
                cell: null
            },
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null
        },
        hunter: {
            15: {
                name: "",
                icon: "",
                cell: null
            },
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null
        },
        shaman: {
            15: {
                name: "",
                icon: "",
                cell: null
            },
            30: {
                name: "",
                icon: "",
                cell: null
            },
            45: {
                name: "",
                icon: "",
                cell: null
            },
            60: {
                name: "",
                icon: "",
                cell: null
            },
            75: {
                name: "",
                icon: "",
                cell: null
            },
            90: {
                name: "",
                icon: "",
                cell: null
            },
            rows: null
        }
    }

};
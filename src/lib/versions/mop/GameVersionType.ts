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
            15: [
                {
                    name: "Feline Swiftness", icon: "spell_druid_tirelesspursuit", id: 131768, cell: null, max_rank: null
                },
                { name: "Displacer Beast", icon: "spell_druid_displacement", id: 102280, cell: null, max_rank: null },
                { name: "Wild Charge", icon: "spell_druid_wildcharge", id: 102401, cell: null, max_rank: null }
            ],
            30: [
                { name: "Ysera's Gift", icon: "inv_misc_head_dragon_green", id: 145108, cell: null, max_rank: null },
                { name: "Renewal", icon: "spell_nature_natureblessing", id: 108238, cell: null, max_rank: null },
                { name: "Cenarion Ward", icon: "ability_druid_naturalperfection", id: 102351, cell: null, max_rank: null }
            ],
            45: [
                { name: "Faerie Swarm", icon: "spell_druid_swarm", id: 106707, cell: null, max_rank: null },
                { name: "Mass Entanglement", icon: "spell_druid_massentanglement", id: 102359, cell: null, max_rank: null },
                { name: "Typhoon", icon: "ability_druid_typhoon", id: 132469, cell: null, max_rank: null }
            ],
            60: [
                { name: "Soul of the Forest", icon: "ability_druid_manatree", id: 114107, cell: null, max_rank: null },
                { name: "Incarnation", icon: "spell_druid_incarnation", id: 106731, cell: null, max_rank: null },
                { name: "Force of Nature", icon: "ability_druid_forceofnature", id: 106737, cell: null, max_rank: null}
            ],
            75: [
                { name: "Disorienting Roar", icon: "ability_druid_demoralizingroar", id: 99, cell: null, max_rank: null},
                { name: "Ursol's Vortex", icon: "spell_druid_ursolsvortex", id: 102793, cell: null, max_rank: null},
                { name: "Mighty Bash", icon: "ability_druid_bash", id: 5211, cell: null, max_rank: null}
            ],
            90: [
                { name: "Heart of the Wild", icon: "spell_holy_blessingofagility", id: 108288, cell: null, max_rank: null},
                { name: "Dream of Cenarius", icon: "ability_druid_dreamstate", id: 108373, cell: null, max_rank: null},
                { name: "Nature's Vigil", icon: "achievement_zone_feralas", id: 124974, cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        warrior: {
            15: [
                { name: "Juggernaut", icon: "ability_warrior_bullrush", id: 103826, cell: null, max_rank: null},
                { name: "Double Time", icon: "inv_misc_horn_04", id: 103827, cell: null, max_rank: null},
                { name: "Warbringer", icon: "ability_warrior_warbringer", id: 103828, cell: null, max_rank: null}
            ],
            30: [
                { name: "Enraged Regeneration", icon: "ability_warrior_focusedrage", id: 55694, cell: null, max_rank: null},
                { name: "Second Wind", icon: "ability_hunter_harass", id: 29838, cell: null, max_rank: null},
                { name: "Impending Victory", icon: "spell_impending_victory", id: 103840, cell: null, max_rank: null}
            ],
            45: [
                { name: "Staggering Shout", icon: "ability_bullrush", id: 107566, cell: null, max_rank: null},
                { name: "Piercing Howl", icon: "spell_shadow_deathscream", id: 12323, cell: null, max_rank: null},
                { name: "Disrupting Shout", icon: "warrior_disruptingshout", id: 102060, cell: null, max_rank: null}
            ],
            60: [
                { name: "Bladestorm", icon: "ability_warrior_bladestorm", id: 46924, cell: null, max_rank: null},
                { name: "Shockwave", icon: "ability_warrior_shockwave", id: 46968, cell: null, max_rank: null},
                { name: "Dragon Roar", icon: "ability_warrior_dragonroar", id: 118000, cell: null, max_rank: null}
            ],
            75: [
                { name: "Mass Spell Reflection", icon: "ability_warrior_shieldbreak", id: 114028, cell: null, max_rank: null},
                { name: "Safeguard", icon: "ability_warrior_safeguard", id: 114029, cell: null, max_rank: null},
                { name: "Vigilance", icon: "ability_warrior_vigilance", id: 114030, cell: null, max_rank: null}
            ],
            90: [
                { name: "Avatar", icon: "warrior_talent_icon_avatar", id: 107574, cell: null, max_rank: null},
                { name: "Bloodbath", icon: "ability_warrior_bloodbath", id: 12292, cell: null, max_rank: null},
                { name: "Storm Bolt", icon: "warrior_talent_icon_stormbolt", id: 107570, cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        mage: {
            15: [
                { name: "Presence of Mind", icon: "spell_nature_enchantarmor", id: 12043, cell: null, max_rank: null},
                { name: "Blazing Speed", icon: "spell_fire_burningspeed", id: 108843, cell: null, max_rank: null},
                { name: "Ice Floes", icon: "spell_mage_iceflows", id: 108839, cell: null, max_rank: null}
            ],
            30: [
                { name: "Temporal Shield", icon: "spell_mage_temporalshield", id: 115610, cell: null, max_rank: null},
                { name: "Flameglow", icon: "inv_elemental_primal_fire", id: 140468, cell: null, max_rank: null},
                { name: "Ice Barrier", icon: "spell_ice_lament", id: 11426, cell: null, max_rank: null}
            ],
            45: [
                { name: "Ring of Frost", icon: "spell_frost_ring-of-frost", id: 113724, cell: null, max_rank: null},
                { name: "Ice Ward", icon: "spell_frost_frostward", id: 111264, cell: null, max_rank: null},
                { name: "Frostjaw", icon: "ability_mage_frostjaw", id: 102051, cell: null, max_rank: null}
            ],
            60: [
                { name: "Greater Invisibility", icon: "ability_mage_greaterinvisibility", id: 110959, cell: null, max_rank: null},
                { name: "Cauterize", icon: "spell_fire_rune", id: 86949, cell: null, max_rank: null},
                { name: "Cold Snap", icon: "spell_frost_wizardmark", id: 11958, cell: null, max_rank: null}
            ],
            75: [
                { name: "Nether Tempest", icon: "spell_mage_nethertempest", id: 114923, cell: null, max_rank: null},
                { name: "Living Bomb", icon: "ability_mage_livingbomb", id: 44457, cell: null, max_rank: null},
                { name: "Frost Bomb", icon: "spell_mage_frostbomb", id: 112948, cell: null, max_rank: null}
            ],
            90: [
                { name: "Invocation", icon: "spell_arcane_arcane03", id: 114003, cell: null, max_rank: null},
                { name: "Rune of Power", icon: "spell_mage_runeofpower", id: 116011, cell: null, max_rank: null},
                { name: "Incanter's Ward", icon: "spell_shadow_detectlesserinvisibility", id: 1463, cell: null, max_rank: null}
            ],
            talent_tree: null

        },
        warlock: {
            15: [
                { name: "Dark Regeneration", icon: "spell_warlock_darkregeneration", id: 108359, cell: null, max_rank: null},
                { name: "Soul Leech", icon: "warlock_siphonlife", id: 108370, cell: null, max_rank: null},
                { name: "Harvest Life", icon: "spell_warlock_harvestoflife", id: 108371, cell: null, max_rank: null}
            ],
            30: [
                { name: "Demonic Breath", icon: "ability_warlock_shadowflame", id: 47897, cell: null, max_rank: null},
                { name: "Mortal Coil", icon: "ability_warlock_mortalcoil", id: 6789, cell: null, max_rank: null},
                { name: "Shadowfury", icon: "ability_warlock_shadowfurytga", id: 30283, cell: null, max_rank: null}
            ],
            45: [
                { name: "Soul Link", icon: "ability_warlock_soullink", id: 108415, cell: null, max_rank: null},
                { name: "Sacrificial Pact", icon: "warlock_sacrificial_pact", id: 108416, cell: null, max_rank: null},
                { name: "Dark Bargain", icon: "ability_deathwing_bloodcorruption_death", id: 110913, cell: null, max_rank: null}
            ],
            60: [
                { name: "Blood Horror", icon: "ability_deathwing_bloodcorruption_earth", id: 111397, cell: null, max_rank: null},
                { name: "Burning Rush", icon: "ability_deathwing_sealarmorbreachtga", id: 111400, cell: null, max_rank: null},
                { name: "Unbound Will", icon: "warlock_spelldrain", id: 108482, cell: null, max_rank: null}
            ],
            75: [
                { name: "Grimoire of Supremacy", icon: "warlock_grimoireofcommand", id: 108499, cell: null, max_rank: null},
                { name: "Grimoire of Service", icon: "warlock_grimoireofservice", id: 108501, cell: null, max_rank: null},
                { name: "Grimoire of Sacrifice", icon: "warlock_grimoireofsacrifice", id: 108503, cell: null, max_rank: null}
            ],
            90: [
                { name: "Archimonde's Darkness", icon: "achievement_boss_archimonde", id: 108505, cell: null, max_rank: null},
                { name: "Kil'jaeden's Cunning", icon: "achievement_boss_kiljaedan", id: 137587, cell: null, max_rank: null},
                { name: "Mannoroth's Fury", icon: "achievement_boss_magtheridon", id: 108508, cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        monk: {
            15: [
                { name: "Celerity", icon: "ability_monk_quipunch", id: 108359, cell: null, max_rank: null},
                { name: "Tiger's Lust", icon: "ability_monk_tigerslust", id: 116841, cell: null, max_rank: null},
                { name: "Momentum", icon: "ability_monk_standingkick", id: 115174, cell: null, max_rank: null}
            ],
            30: [
                { name: "Chi Wave", icon: "ability_monk_chiwave", id: 115098, cell: null, max_rank: null},
                { name: "Zen Sphere", icon: "ability_monk_forcesphere", id: 124081, cell: null, max_rank: null},
                { name: "Chi Burst", icon: "spell_arcane_arcanetorrent", id: 123986, cell: null, max_rank: null}
            ],
            45: [
                { name: "Power Strikes", icon: "ability_monk_powerstrikes", id: 121817, cell: null, max_rank: null},
                { name: "Ascension", icon: "ability_monk_ascension", id: 115396, cell: null, max_rank: null},
                { name: "Chi Brew", icon: "ability_monk_chibrew", id: 115399, cell: null, max_rank: null}
            ],
            60: [
                { name: "Ring of Peace", icon: "spell_monk_ringofpeace", id: 116844, cell: null, max_rank: null},
                { name: "Charging Ox Wave", icon: "ability_monk_chargingoxwave", id: 119392, cell: null, max_rank: null},
                { name: "Leg Sweep", icon: "ability_monk_legsweep", id: 119381, cell: null, max_rank: null}
            ],
            75: [
                { name: "Healing Elixirs", icon: "ability_monk_jasmineforcetea", id: 122280, cell: null, max_rank: null},
                { name: "Dampen Harm", icon: "ability_monk_dampenharm", id: 122278, cell: null, max_rank: null},
                { name: "Diffuse Magic", icon: "spell_monk_diffusemagic", id: 122783, cell: null, max_rank: null}
            ],
            90: [
                { name: "Rushing Jade Wind", icon: "ability_monk_rushingjadewind", id: 116847, cell: null, max_rank: null},
                { name: "Invoke Xuen, the White Tiger", icon: "ability_monk_summontigerstatue", id: 123904, cell: null, max_rank: null},
                { name: "Chi Torpedo", icon: "ability_monk_quitornado", id: 115008, cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        paladin: {
            15: [
                { id: 85499, name: "Speed of Light", icon: "ability_paladin_speedoflight", cell: null, max_rank: null},
                { id: 87172, name: "Long Arm of the Law", icon: "ability_paladin_longarmofthelaw", cell: null, max_rank: null},
                { id: 26023, name: "Pursuit of Justice", icon: "ability_paladin_veneration", cell: null, max_rank: null}
            ],
            30: [
                { id: 105593, name: "Fist of Justice", icon: "spell_holy_fistofjustice", cell: null, max_rank: null},
                { id: 20066, name: "Repentance", icon: "spell_holy_prayerofhealing", cell: null, max_rank: null},
                { id: 110301, name: "Evil is a Point of View", icon: "ability_paladin_turnevil", cell: null, max_rank: null}
            ],
            45: [
                { id: 85804, name: "Selfless Healer", icon: "ability_paladin_gaurdedbythelight", cell: null, max_rank: null},
                { id: 114163, name: "Eternal Flame", icon: "inv_torch_thrown", cell: null, max_rank: null},
                { id: 20925, name: "Sacred Shield", icon: "ability_paladin_blessedmending", cell: null, max_rank: null}
            ],
            60: [
                { id: 114039, name: "Hand of Purity", icon: "spell_holy_sealofwisdom", cell: null, max_rank: null},
                { id: 114154, name: "Unbreakable Spirit", icon: "spell_holy_unyieldingfaith", cell: null, max_rank: null},
                { id: 105622, name: "Clemency", icon: "ability_paladin_clemency", cell: null, max_rank: null}
            ],
            75: [
                { id: 105809, name: "Holy Avenger", icon: "ability_paladin_holyavenger", cell: null, max_rank: null},
                { id: 53376, name: "Sanctified Wrath", icon: "ability_paladin_sanctifiedwrath", cell: null, max_rank: null},
                { id: 86172, name: "Divine Purpose", icon: "spell_holy_divinepurpose", cell: null, max_rank: null}
            ],
            90: [
                { id: 114165, name: "Holy Prism", icon: "spell_paladin_holyprism", cell: null, max_rank: null},
                { id: 114158, name: "Light's Hammer", icon: "spell_paladin_lightshammer", cell: null, max_rank: null},
                { id: 114157, name: "Execution Sentence", icon: "spell_paladin_executionsentence", cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        rogue: {
            15: [
                { name: "Nightstalker", icon: "ability_stealth", id: 14062, cell: null, max_rank: null},
                { name: "Subterfuge", icon: "rogue_subterfuge", id: 108208, cell: null, max_rank: null},
                { name: "Shadow Focus", icon: "rogue_shadowfocus", id: 108209, cell: null, max_rank: null}
            ],
            30: [
                { name: "Deadly Throw", icon: "inv_throwingknife_06", id: 26679, cell: null, max_rank: null},
                { name: "Nerve Strike", icon: "rogue_nerve_strike", id: 108210, cell: null, max_rank: null},
                { name: "Combat Readiness", icon: "ability_rogue_combatreadiness", id: 74001, cell: null, max_rank: null}
            ],
            45: [
                { name: "Cheat Death", icon: "ability_rogue_cheatdeath", id: 31230, cell: null, max_rank: null},
                { name: "Leeching Poison", icon: "rogue_leeching_poison", id: 108211, cell: null, max_rank: null},
                { name: "Elusiveness", icon: "ability_rogue_turnthetables", id: 79008, cell: null, max_rank: null}
            ],
            60: [
                { name: "Cloak and Dagger", icon: "ability_rogue_unfairadvantage", id: 138106, cell: null, max_rank: null},
                { name: "Shadowstep", icon: "ability_rogue_shadowstep", id: 36554, cell: null, max_rank: null},
                { name: "Burst of Speed", icon: "rogue_burstofspeed", id: 108212, cell: null, max_rank: null}
            ],
            75: [
                { name: "Prey on the Weak", icon: "ability_rogue_preyontheweak", id: 131511, cell: null, max_rank: null},
                { name: "Paralytic Poison", icon: "rogue_paralytic_poison", id: 108215, cell: null, max_rank: null},
                { name: "Dirty Tricks", icon: "ability_rogue_dirtydeeds", id: 108216, cell: null, max_rank: null}
            ],
            90: [
                { name: "Shuriken Toss", icon: "inv_throwingknife_07", id: 114014, cell: null, max_rank: null},
                { name: "Marked for Death", icon: "achievement_bg_killingblow_berserker", id: 137619, cell: null, max_rank: null},
                { name: "Anticipation", icon: "ability_rogue_slaughterfromtheshadows", id: 114015, cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        priest: {
            15: [
                { name: "Void Tendrils", icon: "spell_priest_voidtendrils", id: 108920, cell: null, max_rank: null},
                { name: "Psyfiend", icon: "spell_priest_psyfiend", id: 108921, cell: null, max_rank: null},
                { name: "Dominate Mind", icon: "spell_shadow_shadowworddominate", id: 605, cell: null, max_rank: null}
            ],
            30: [
                { name: "Body and Soul", icon: "spell_holy_symbolofhope", id: 64129, cell: null, max_rank: null},
                { name: "Angelic Feather", icon: "ability_priest_angelicfeather", id: 121536, cell: null, max_rank: null},
                { name: "Phantasm", icon: "ability_priest_phantasm", id: 108942, cell: null, max_rank: null}
            ],
            45: [
                { name: "From Darkness, Comes Light", icon: "spell_holy_surgeoflight", id: 109186, cell: null, max_rank: null},
                { name: "Mindbender", icon: "spell_shadow_soulleech_3", id: 123040, cell: null, max_rank: null},
                { name: "Solace and Insanity", icon: "ability_priest_flashoflight", id: 139139, cell: null, max_rank: null}
            ],
            60: [
                { name: "Desperate Prayer", icon: "spell_holy_testoffaith", id: 19236, cell: null, max_rank: null},
                { name: "Spectral Guise", icon: "spell_priest_spectralguise", id: 112833, cell: null, max_rank: null},
                { name: "Angelic Bulwark", icon: "ability_priest_angelicbulwark", id: 108945, cell: null, max_rank: null}
            ],
            75: [
                { name: "Twist of Fate", icon: "spell_shadow_mindtwisting", id: 109142, cell: null, max_rank: null},
                { name: "Power Infusion", icon: "spell_holy_powerinfusion", id: 10060, cell: null, max_rank: null},
                { name: "Divine Insight", icon: "spell_priest_burningwill", id: 109175, cell: null, max_rank: null}
            ],
            90: [
                { name: "Cascade", icon: "ability_priest_cascade", id: 121135, cell: null, max_rank: null},
                { name: "Divine Star", icon: "spell_priest_divinestar", id: 110744, cell: null, max_rank: null},
                { name: "Halo", icon: "ability_priest_halo", id: 120517, cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        deathknight: {
            15: [
                { name: "Roiling Blood", icon: "ability_deathknight_roilingblood", id: 108170, cell: null, max_rank: null},
                { name: "Plague Leech", icon: "ability_creature_disease_02", id: 123693, cell: null, max_rank: null},
                { name: "Unholy Blight", icon: "spell_shadow_contagion", id: 115989, cell: null, max_rank: null}
            ],
            30: [
                { name: "Lichborne", icon: "spell_shadow_raisedead", id: 49039, cell: null, max_rank: null},
                { name: "Anti-Magic Zone", icon: "spell_deathknight_antimagiczone", id: 51052, cell: null, max_rank: null},
                { name: "Purgatory", icon: "inv_misc_shadowegg", id: 114556, cell: null, max_rank: null}
            ],
            45: [
                { name: "Death's Advance", icon: "spell_shadow_demonicempathy", id: 96268, cell: null, max_rank: null},
                { name: "Chilblains", icon: "spell_frost_wisp", id: 50041, cell: null, max_rank: null},
                { name: "Asphyxiate", icon: "ability_deathknight_asphixiate", id: 108194, cell: null, max_rank: null}
            ],
            60: [
                { name: "Death Pact", icon: "spell_shadow_deathpact", id: 48743, cell: null, max_rank: null},
                { name: "Death Siphon", icon: "ability_deathknight_deathsiphon", id: 108196, cell: null, max_rank: null},
                { name: "Conversion", icon: "ability_deathknight_deathsiphon2", id: 119975, cell: null, max_rank: null}
            ],
            75: [
                { name: "Blood Tap", icon: "spell_deathknight_bloodtap", id: 45529, cell: null, max_rank: null},
                { name: "Runic Empowerment", icon: "inv_misc_rune_10", id: 81229, cell: null, max_rank: null},
                { name: "Runic Corruption", icon: "spell_shadow_rune", id: 51462, cell: null, max_rank: null}
            ],
            90: [
                { name: "Gorefiend's Grasp", icon: "ability_deathknight_aoedeathgrip", id: 108199, cell: null, max_rank: null},
                { name: "Remorseless Winter", icon: "ability_deathknight_remorselesswinters2", id: 108200, cell: null, max_rank: null},
                { name: "Desecrated Ground", icon: "ability_deathknight_desecratedground", id: 108201, cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        hunter: {
            15: [
                { name: "Posthaste", icon: "ability_hunter_posthaste", id: 109215, cell: null, max_rank: null},
                { name: "Narrow Escape", icon: "inv_misc_web_01", id: 109298, cell: null, max_rank: null},
                { name: "Crouching Tiger, Hidden Chimera", icon: "ability_hunter_pet_chimera", id: 118675, cell: null, max_rank: null}
            ],
            30: [
                { name: "Binding Shot", icon: "spell_shaman_bindelemental", id: 109248, cell: null, max_rank: null},
                { name: "Wyvern Sting", icon: "inv_spear_02", id: 19386, cell: null, max_rank: null},
                { name: "Intimidation", icon: "ability_devour", id: 19577, cell: null, max_rank: null}
            ],
            45: [
                { name: "Exhilaration", icon: "ability_hunter_onewithnature", id: 109304, cell: null, max_rank: null},
                { name: "Aspect of the Iron Hawk", icon: "spell_hunter_aspectoftheironhawk", id: 109260, cell: null, max_rank: null},
                { name: "Spirit Bond", icon: "ability_druid_demoralizingroar", id: 109212, cell: null, max_rank: null}
            ],
            60: [
                { name: "Fervor", icon: "ability_hunter_aspectoftheviper", id: 82726, cell: null, max_rank: null},
                { name: "Dire Beast", icon: "ability_hunter_sickem", id: 120679, cell: null, max_rank: null},
                { name: "Thrill of the Hunt", icon: "ability_hunter_thrillofthehunt", id: 109306, cell: null, max_rank: null}
            ],
            75: [
                { name: "A Murder of Ctalent_tree", icon: "ability_hunter_murderofctalent_tree", id: 131894, cell: null, max_rank: null},
                { name: "Blink Strikes", icon: "spell_arcane_arcane04", id: 130392, cell: null, max_rank: null},
                { name: "Lynx Rush", icon: "ability_hunter_catlikereflexes", id: 120697, cell: null, max_rank: null}
            ],
            90: [
                { name: "Glaive Toss", icon: "ability_glaivetoss", id: 117050, cell: null, max_rank: null},
                { name: "Powershot", icon: "ability_hunter_resistanceisfutile", id: 109259, cell: null, max_rank: null},
                { name: "Barrage", icon: "ability_hunter_rapidregeneration", id: 120360, cell: null, max_rank: null}
            ],
            talent_tree: null
        },
        shaman: {
            15: [
                { name: "Nature's Guardian", icon: "spell_nature_natureguardian", id: 30884, cell: null, max_rank: null},
                { name: "Stone Bulwark Totem", icon: "ability_shaman_stonebulwark", id: 108270, cell: null, max_rank: null},
                { name: "Astral Shift", icon: "ability_shaman_astralshift", id: 108271, cell: null, max_rank: null}
            ],
            30: [
                { name: "Frozen Power", icon: "spell_fire_bluecano", id: 63374, cell: null, max_rank: null},
                { name: "Earthgrab Totem", icon: "spell_nature_stranglevines", id: 51485, cell: null, max_rank: null},
                { name: "Windwalk Totem", icon: "ability_shaman_windwalktotem", id: 108273, cell: null, max_rank: null}
            ],
            45: [
                { name: "Call of the Elements", icon: "ability_shaman_multitotemactivation", id: 108285, cell: null, max_rank: null},
                { name: "Totemic Persistence", icon: "ability_shaman_totemcooldownrefund", id: 108284, cell: null, max_rank: null},
                { name: "Totemic Projection", icon: "ability_shaman_totemrelocation", id: 108287, cell: null, max_rank: null}
            ],
            60: [
                { name: "Elemental Mastery", icon: "spell_nature_wispheal", id: 16166, cell: null, max_rank: null},
                { name: "Ancestral Swiftness", icon: "spell_shaman_elementaloath", id: 16188, cell: null, max_rank: null},
                { name: "Echo of the Elements", icon: "ability_shaman_echooftheelements", id: 108283, cell: null, max_rank: null}
            ],
            75: [
                { name: "Rushing Streams", icon: "inv_spear_04", id: 147074, cell: null, max_rank: null},
                { name: "Ancestral Guidance", icon: "ability_shaman_ancestralguidance", id: 108281, cell: null, max_rank: null},
                { name: "Conductivity", icon: "ability_shaman_fortifyingwaters", id: 108282, cell: null, max_rank: null}
            ],
            90: [
                { name: "Unleashed Fury", icon: "shaman_talent_unleashedfury", id: 117012, cell: null, max_rank: null},
                { name: "Primal Elementalist", icon: "shaman_talent_primalelementalist", id: 117013, cell: null, max_rank: null},
                { name: "Elemental Blast", icon: "shaman_talent_elementalblast", id: 117014, cell: null, max_rank: null}
            ],
            talent_tree: null
        }
    }

};
export enum Gender {
  Male = "Male",
  Female = "Female"
}

export enum Faction {
  Alliance = "Alliance",
  Horde = "Horde"
}

export enum Race {
  Human = "Human",
  Dwarf = "Dwarf",
  Gnome = "Gnome",
  Nightelf = "Nightelf",
  Draenei = "Draenei",
  Worgen = "Worgen",
  Orc = "Orc",
  Troll = "Troll",
  Undead = "Undead",
  Tauren = "Tauren",
  Bloodelf = "Bloodelf",
  Goblin = "Goblin",
  Pandaren = "Pandaren",
  Alien = "Alien"
}

export enum PlayerClass {
  Deathknight = "Deathknight",
  Druid = "Druid",
  Hunter = "Hunter",
  Mage = "Mage",
  Paladin = "Paladin",
  Priest = "Priest",
  Rogue = "Rogue",
  Shaman = "Shaman",
  Warlock = "Warlock",
  Warrior = "Warrior",
  Monk = "Monk",
  Adventurer = "Adventurer"
}

export const ClassColour: {
  [class_name in PlayerClass]: string;
} = {
  Deathknight: "#C41F3B",
  Druid: "#FF7D0A",
  Hunter: "#A9D271",
  Mage: "#40C7EB",
  Paladin: "#F58CBA",
  Priest: "#FFFFFF",
  Rogue: "#FFF569",
  Shaman: "#0070DE",
  Warlock: "#8787ED",
  Warrior: "#C79C6E",
  Monk: "#00FF96",
  Adventurer: "#000000"
};

export enum PlayerSpec {
  DeathknightBlood = "Blood",
  DeathknightFrost = "Frost",
  DeathknightUnholy = "Unholy",
  DruidBalance = "Balance",
  DruidFeral = "Feral",
  DruidGuardian = "Guardian",
  DruidRestoration = "Restoration",
  HunterBeastmastery = "Beastmastery",
  HunterMarksmanship = "Marksmanship",
  HunterSurvival = "Survival",
  MageArcane = "Arcane",
  MageFire = "Fire",
  MageFrost = "Frost",
  PriestDiscipline = "Discipline",
  PriestHoly = "Holy",
  PriestShadow = "Shadow",
  PaladinHoly = "Holy",
  PaladinProtection = "Protection",
  PaladinRetribution = "Retribution",
  RogueAssassination = "Assassination",
  RogueCombat = "Combat",
  RogueSubtlety = "Subtlety",
  WarlockAffliction = "Affliction",
  WarlockDemonology = "Demonology",
  WarlockDestruction = "Destruction",
  ShamanElemental = "Elemental",
  ShamanEnhancement = "Enhancement",
  ShamanRestoration = "Restoration",
  WarriorArms = "Arms",
  WarriorFury = "Fury",
  WarriorProtection = "Protection",
  MonkBrewmaster = "Brewmaster",
  MonkWindwalker = "Windwalker",
  MonkMistweaver = "Mistweaver",
  AdventurerAdventurer = "Adventurer"
}

export enum RaceFaction {
  Human = Faction.Alliance,
  Dwarf = Faction.Alliance,
  Gnome = Faction.Alliance,
  Nightelf = Faction.Alliance,
  Draenei = Faction.Alliance,
  Worgen = Faction.Alliance,
  Orc = Faction.Horde,
  Troll = Faction.Horde,
  Tauren = Faction.Horde,
  Undead = Faction.Horde,
  Bloodelf = Faction.Horde,
  Goblin = Faction.Horde,
}

export const UNKNOWN_CLASS = "Adventurer"
export const UNKNOWN_SPEC = "Adventurer"
export const UNKNOWN_RACE = "Alien"
export const ICON_QUESTIONMARK = "inv_misc_questionmark";
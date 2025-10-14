import { UNKNOWN_CLASS, UNKNOWN_SPEC } from "$lib/consts";
import { sortByNameMoveLast } from "$lib/helper/sort";
import type { GameVersionType } from "./GameVersionTypes";
import { PlayerClass } from "./PlayerClass";
import { PlayerFaction } from "./PlayerFaction";
import { PlayerFactionRace } from "./PlayerFactionRace";
import { PlayerRace } from "./PlayerRace";
import { PlayerRaceClass } from "./playerRaceClass";
import { PlayerSpec } from "./PlayerSpecialization";
import { PlayerTalent } from "./PlayerTalent";

export abstract class BaseGameVersion {
    protected classes: PlayerClass[] = [];
    protected specs: PlayerSpec[] = [];
    protected races: PlayerRace[] = [];
    protected factions: PlayerFaction[] = [];
    protected raceClasses: PlayerRaceClass[] = [];
    protected factionRaces: PlayerFactionRace[] = [];
    protected maxLevel: number = 1;
    protected talents: PlayerTalent;

    protected constructor(versionSource: GameVersionType) {
        this.classes = versionSource.classes
            .map((c) => PlayerClass.fromSource(c))
            .sort(sortByNameMoveLast(UNKNOWN_CLASS));
        this.specs = versionSource.specs
            .map((s) => PlayerSpec.fromSource(s, this.classes))
            .sort(sortByNameMoveLast(UNKNOWN_SPEC));
        this.races = versionSource.races
            .map((r) => PlayerRace.fromSource(r))
            .sort(sortByNameMoveLast(UNKNOWN_SPEC));
        this.factions = [{ name: "Horde", icon: 'inv_bannerpvp_01' }, { name: "Alliance", icon: 'inv_bannerpvp_02' }].map((f) => PlayerFaction.fromSource(f));
        this.raceClasses = versionSource.raceClasses
            .map((rc) => PlayerRaceClass.fromSource(rc));
        this.factionRaces = versionSource.factionRaces
            .map((fr) => PlayerFactionRace.fromSource(fr));
        this.maxLevel = versionSource.maxLevel;
        this.talents = PlayerTalent.fromSource(versionSource.talents);
    }

    abstract getName(): GameVersionName;

    getClasses(): PlayerClass[] {
        return this.classes;
    }

    getSpecs(): PlayerSpec[] {
        return this.specs;
    }

    getRaces(): PlayerRace[] {
        return this.races;
    }

    getFactions(): PlayerFaction[] {
        return this.factions;
    }

    getRaceClasses(race: string): PlayerRaceClass[] {
        if (race) {
            return this.raceClasses.filter((rc: PlayerRaceClass) => rc.race === race)
        }
        return this.raceClasses;
    }

    getFactionRaces(faction: string): PlayerFactionRace[] {

        if (faction) {
            return this.factionRaces.filter((rc: PlayerFactionRace) => rc.faction === faction)
        }
        return this.factionRaces;
    }

    getMaxLevel(): number {
        return this.maxLevel
    }

    getTalents(): PlayerTalent {
        return this.talents;
    }

}

export enum GameVersionName {
    WOD = "wod",
    MOP = 'mop',
    CATA = 'cata',
    WOTLK = "wotlk",
    TBC = "tbc",
    CLASSIC = "classic"
}
import { UNKNOWN_CLASS, UNKNOWN_SPEC } from "$lib/consts";
import { sortByNameMoveLast } from "$lib/helper/sort";
import type { GameVersionType } from "./GameVersionTypes";
import { PlayerClass } from "./PlayerClass";
import { PlayerSpec } from "./PlayerSpecialization";

export abstract class BaseGameVersion {
    protected classes: PlayerClass[] = [];
    protected specs: PlayerSpec[] = [];

    protected constructor(versionSource: GameVersionType) {
        this.classes = versionSource.classes
            .map((c) => PlayerClass.fromSource(c))
            .sort(sortByNameMoveLast(UNKNOWN_CLASS));
        this.specs = versionSource.specs
            .map((s) => PlayerSpec.fromSource(s, this.classes))
            .sort(sortByNameMoveLast(UNKNOWN_SPEC));
    }

    abstract getName(): GameVersionName;

    getClasses(): PlayerClass[] {
        return this.classes;
    }

    getSpecs(): PlayerSpec[] {
        return this.specs;
    }

}

export enum GameVersionName {
    WOD = "wod",
    MOP = 'mop',
    CATACLYSM = 'cataclysm',
    WOTLK = "wotlk",
    TBC = "tbc",
    CLASSIC = "classic"
}
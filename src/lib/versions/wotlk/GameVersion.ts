import { BaseGameVersion, GameVersionName } from "$lib/versions/GameVersion";
import { versionType } from "$lib/versions/mop/source";

export class GameVersion extends BaseGameVersion {
    constructor() {
        super(versionType);
    }

    getName(): GameVersionName {
        return GameVersionName.WOTLK;
    }
}
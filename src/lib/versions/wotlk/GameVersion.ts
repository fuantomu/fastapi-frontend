import { BaseGameVersion, GameVersionName } from "$lib/versions/GameVersion";
import { versionType } from "$lib/versions/wotlk/GameVersionType";

export class GameVersion extends BaseGameVersion {
    constructor() {
        super(versionType);
    }

    getName(): GameVersionName {
        return GameVersionName.WOTLK;
    }
}
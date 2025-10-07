import { error } from '@sveltejs/kit';
import { IconProvider as WodIconProvider } from '$lib/versions/wod/IconProvider';
import { IconProvider as MopIconProvider } from '$lib/versions/mop/IconProvider';
import { IconProvider as CataIconProvider } from '$lib/versions/cataclysm/IconProvider';
import { IconProvider as WotlkIconProvider } from '$lib/versions/wotlk/IconProvider';
import { IconProvider as TbcIconProvider } from '$lib/versions/tbc/IconProvider';
import { IconProvider as ClassicIconProvider } from '$lib/versions/classic/IconProvider';
import type { BaseGameVersion } from '$lib/versions/GameVersion';
import { GameVersionName } from '$lib/versions/GameVersion';
import type { BaseIconProvider } from '$lib/versions/BaseIconProvider';
import type { VersionContext } from '$lib/versions/VersionContext';
import { GameVersion as WodGameVersion } from './wod/GameVersion';
import { GameVersion as MopGameVersion } from './mop/GameVersion';
import { GameVersion as CataGameVersion } from './cataclysm/GameVersion';
import { GameVersion as WotlkGameVersion } from './wotlk/GameVersion';
import { GameVersion as TbcGameVersion } from './tbc/GameVersion';
import { GameVersion as ClassicGameVersion } from './classic/GameVersion';

export class GameVersionFactory {
    static createIconProvider(gameVersion: GameVersionName): BaseIconProvider {
        switch (gameVersion) {
            case GameVersionName.WOD:
                return new WodIconProvider();
            case GameVersionName.MOP:
                return new MopIconProvider();
            case GameVersionName.CATACLYSM:
                return new CataIconProvider();
            case GameVersionName.WOTLK:
                return new WotlkIconProvider();
            case GameVersionName.TBC:
                return new TbcIconProvider();
            case GameVersionName.CLASSIC:
                return new ClassicIconProvider();
        }
        throw error(400, 'Game version not supported');
    }

    static createGameVersion(gameVersion: GameVersionName): BaseGameVersion {
        switch (gameVersion) {
            case GameVersionName.WOD:
                return new WodGameVersion();
            case GameVersionName.MOP:
                return new MopGameVersion();
            case GameVersionName.CATACLYSM:
                return new CataGameVersion();
            case GameVersionName.WOTLK:
                return new WotlkGameVersion();
            case GameVersionName.TBC:
                return new TbcGameVersion();
            case GameVersionName.CLASSIC:
                return new ClassicGameVersion();
        }
        throw error(400, 'Game version not supported');
    }

    static getDefaultContext(): VersionContext {
        try {
            return {
                iconProvider: GameVersionFactory.createIconProvider(window.location.pathname.split("/")[1] as GameVersionName),
                gameVersion: GameVersionFactory.createGameVersion(window.location.pathname.split("/")[1] as GameVersionName),
            };
        }
        catch (err) {
            window.location.href = "/mop"
            return {
                iconProvider: GameVersionFactory.createIconProvider(GameVersionName.MOP),
                gameVersion: new MopGameVersion(),
            };
        }

    }

    static getContext(gameVersion: GameVersionName): VersionContext {
        return {
            iconProvider: GameVersionFactory.createIconProvider(gameVersion),
            gameVersion: GameVersionFactory.createGameVersion(gameVersion),
        };
    }
}
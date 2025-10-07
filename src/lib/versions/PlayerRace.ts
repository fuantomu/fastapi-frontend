import type { PlayerRaceType } from '$lib/versions/GameVersionTypes';

export class PlayerRace {
    private readonly _name: string;
    private readonly _icon_male: string;
    private readonly _icon_female: string;

    private constructor(name: string, icon_male: string, icon_female: string) {
        this._name = name;
        this._icon_male = icon_male;
        this._icon_female = icon_female;
    }

    get name(): string {
        return this._name;
    }

    get icon_male(): string {
        return this._icon_male;
    }

    get icon_female(): string {
        return this._icon_female;
    }

    static fromSource(source: PlayerRaceType) {
        return new PlayerRace(source.name, source.icon_male, source.icon_female);
    }
}
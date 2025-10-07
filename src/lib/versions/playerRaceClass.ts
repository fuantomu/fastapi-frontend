import type { PlayerRaceClassType } from '$lib/versions/GameVersionTypes';

export class PlayerRaceClass {
    private readonly _race: string;
    private readonly _rclass: string;

    private constructor(race: string, f_class: string) {
        this._race = race;
        this._rclass = f_class;
    }

    get race(): string {
        return this._race;
    }

    get rclass(): string {
        return this._rclass;
    }

    static fromSource(source: PlayerRaceClassType) {
        return new PlayerRaceClass(source.race, source.class);
    }
}
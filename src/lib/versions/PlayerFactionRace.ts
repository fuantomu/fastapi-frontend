import type { PlayerFactionRaceType } from '$lib/versions/GameVersionTypes';

export class PlayerFactionRace {
    private readonly _faction: string;
    private readonly _frace: string;

    private constructor(faction: string, f_class: string) {
        this._faction = faction;
        this._frace = f_class;
    }

    get faction(): string {
        return this._faction;
    }

    get frace(): string {
        return this._frace;
    }

    static fromSource(source: PlayerFactionRaceType) {
        return new PlayerFactionRace(source.faction, source.race);
    }
}
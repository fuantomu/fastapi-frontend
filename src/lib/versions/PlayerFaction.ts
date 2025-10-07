import type { PlayerFactionType } from '$lib/versions/GameVersionTypes';

export class PlayerFaction {
    private readonly _name: string;
    private readonly _icon: string;

    private constructor(name: string, icon: string) {
        this._name = name;
        this._icon = icon;
    }

    get name(): string {
        return this._name;
    }

    get icon(): string {
        return this._icon;
    }

    static fromSource(source: PlayerFactionType) {
        return new PlayerFaction(source.name, source.icon);
    }
}
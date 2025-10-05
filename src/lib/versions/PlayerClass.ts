import type { PlayerClassType } from '$lib/versions/GameVersionTypes';

export class PlayerClass {
    private readonly _name: string;
    private readonly _icon: string;

    private constructor(name: string, icon: string) {
        this._name = name;
        this._icon = icon;
    }

    get colour(): string {
        return `var(--player-class-colour-${this.name})`;
    }

    get name(): string {
        return this._name;
    }

    get icon(): string {
        return this._icon;
    }

    static fromSource(source: PlayerClassType) {
        return new PlayerClass(source.name, source.icon);
    }
}
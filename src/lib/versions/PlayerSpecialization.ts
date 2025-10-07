import type { PlayerClass } from './PlayerClass';
import type { PlayerSpecType } from './GameVersionTypes';
import { error } from '@sveltejs/kit';

export class PlayerSpec {
	private readonly _name: string;
	private readonly _playerClass: PlayerClass;
	private readonly _icon: string;

	private constructor(
		name: string,
		playerClass: PlayerClass,
		icon: string,
	) {
		this._name = name;
		this._playerClass = playerClass;
		this._icon = icon;
	}

	get name(): string {
		return this._name;
	}

	get playerClass(): PlayerClass {
		return this._playerClass;
	}

	get icon(): string {
		return this._icon;
	}

	static fromSource(
		source: PlayerSpecType,
		classes: PlayerClass[],
	) {
		const playerClass = classes.find((c) => c.name === source.class);
		if (!playerClass) {
			throw error(500, `No class found for spec '${source.name}'`)
		}

		return new PlayerSpec(
			source.name,
			playerClass,
			source.icon,
		);
	}
}
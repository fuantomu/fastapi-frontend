export type GameVersionType = {
	classes: PlayerClassType[];
	specs: PlayerSpecType[];
	races: PlayerRaceType[];
	raceClasses: PlayerRaceClassType[];
	factionRaces: PlayerFactionRaceType[];
	maxLevel: number;
	talents: PlayerTalentType;
};

export type PlayerClassType = {
	name: string;
	icon: string;
};

export type PlayerSpecType = {
	name: string;
	class: string;
	icon: string;
};

export type PlayerRaceType = {
	name: string;
	icon_male: string;
	icon_female: string;
}

export type PlayerFactionType = {
	name: string;
	icon: string;
}

export type PlayerRaceClassType = {
	race: string;
	class: string;
}

export type PlayerFactionRaceType = {
	faction: string;
	race: string;
}

export type Talent = {
	name: string;
	icon: string;
	id: number;
}

export type TalentTreeCell = {
	name: string;
	icon: string;
	cell: string | null;
	ranks: number[]
	connection : string[] | null;
}

export type TalentTreeRow = {
	names: string[];
	1: TalentTreeCell[];
	2: TalentTreeCell[];
	3: TalentTreeCell[];
}

export type TalentRow = {
	15: Talent[] | null;
	30: Talent[] | null;
	45: Talent[] | null;
	60: Talent[] | null;
	75: Talent[] | null;
	90: Talent[] | null;
	talent_tree: TalentTreeRow | null;
}

export type PlayerTalentType = {
	druid: TalentRow;
	mage: TalentRow;
	warlock: TalentRow;
	rogue: TalentRow;
	warrior: TalentRow;
	priest: TalentRow;
	paladin: TalentRow;
	shaman: TalentRow;
	deathknight: TalentRow;
	hunter: TalentRow;
	monk: TalentRow;
}
export type GameVersionType = {
	classes: PlayerClassType[];
	specs: PlayerSpecType[];
	races: PlayerRaceType[];
	raceClasses: PlayerRaceClassType[];
	factionRaces: PlayerFactionRaceType[];
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
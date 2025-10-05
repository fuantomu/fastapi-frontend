export type GameVersionType = {
	classes: PlayerClassType[];
	specs: PlayerSpecType[];
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
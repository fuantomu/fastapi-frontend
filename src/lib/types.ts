
export type Recipe = {
	id: string;
	name: string;
	description?: string;
	ingredients?: Array<RecipeIngredient>;
};

export type RecipeIngredient = {
    name: string;
    quantity: string;
}

export type Ingredient = {
    id: string;
    name: string;
    description?: string;
    alias?: Array<string>;
}
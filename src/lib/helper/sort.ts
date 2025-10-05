export function sortBy(_item1 : any, _item2 : any, key: string) {
    if (_item1[key] < _item2[key]){
        return -1;
    }
    if (_item1[key] > _item2[key]){
        return 1;
    }
    return 0;
}

export const sortByName = (a: SortableWithName, b: SortableWithName): number => {
	if (a.name < b.name) return -1;
	if (a.name > b.name) return 1;
	return 0;
};

export const sortByNameMoveLast =
	(last: string) =>
	(a: SortableWithName, b: SortableWithName): number => {
		if (a.name === last) return 1;
		if (b.name === last) return -1;
		return sortByName(a, b);
	};

interface SortableWithName {
	get name(): string;
}
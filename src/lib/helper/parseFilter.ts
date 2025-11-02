
export function parseModifier(modifier: string, _item1: any, _item2: any) : boolean {
    switch (modifier) {
        case ">":
            return _item1 > _item2
        case ">=":
            return _item1 >= _item2
        case "=":
            return _item1 === _item2
        case "<":
            return _item1 < _item2
        case "<=":
            return _item1 <= _item2
        case "i":
            return _item1.includes(_item2)
        case "sw":
            return _item1.startsWith(_item2)
        case "ew":
            return _item1.endsWith(_item2)
        case "eq":
            return _item1 === _item2
        default:
            return _item1 === _item2
    }
}
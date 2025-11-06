
export function getRankColor(rank: number) {
    if (rank >= 99.95){
        return "tan"
    }
    else if (rank >= 99.01){
        return "pink"
    }
    else if (rank >= 95.01){
        return "orange"
    }
    else if (rank >= 75.01){
        return "purple"
    }
    else if (rank >= 50.01){
        return "blue"
    }
    else if (rank >= 25.01){
        return "green"
    }
    else{
        return "grey"
    }
}

export function getWCLColor(color: string){
    switch(color){
        case "artifact":
            return "tan"
        case "legendary": 
            return "orange"
        case "astounding":
            return "pink"
        case "epic":
            return "purple"
        case "rare":
            return "blue"
        case "uncommon":
            return "green"
        default:
            return "grey"
    }
}
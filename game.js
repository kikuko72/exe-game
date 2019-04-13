'use strict'

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

const ALL_POSITIONS = [
    [new Position(0, 0), new Position(1, 0), new Position(2, 0), new Position(3, 0), new Position(4, 0), new Position(5, 0)],
    [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(3, 1), new Position(4, 1), new Position(5, 1)],
    [new Position(0, 2), new Position(1, 2), new Position(2, 2), new Position(3, 2), new Position(4, 2), new Position(5, 2)]
]

const pos = function(x, y) {
    return ALL_POSITIONS[y][x];
}


class Area {
    constructor(position, owner) {
        this.position = position
        this.owner = owner
    }
}

const GROUP = {
    PLAYER: {owner: 'player'},
    ENEMY: {owner: 'enemy'}
}

class Character {
    constructor(state) {
        this.id = state.id
        this.group = state.group
        this.position = state.position
        this.hp = state.hp
        this.isCharacter = true
    }
}


const patchMap = (srcMap, key, value) => {
    const altMap = new Map([...srcMap.entries()])
    altMap.set(key, value)
    return altMap
}

class Field {
    constructor(areaMap, objects) {
        this.areaMap = areaMap;
        this.objects = objects
    }

    getOwner(position) {
        return this.areaMap.get(position)
    }

    getObjects(position) {
        return this.objects.filter((o) => o.position === position)
    }

    stealArea(altOwner, position) {
        const altMap = patchMap(this.areaMap, position, altOwner)
        return this._patchField({areaMap: altMap}, this)
    }

    _patchField(altState, oldField) {
        const areaMap = altState.areaMap || oldField.areaMap
        const objects = altState.objects || oldField.objects
        return new Field(areaMap, objects)
    }
}

const initArea = () => new Map([
    [pos(0,0), GROUP.ENEMY], [pos(1,0), GROUP.ENEMY], [pos(2,0), GROUP.ENEMY], [pos(3,0), GROUP.PLAYER], [pos(4,0), GROUP.PLAYER], [pos(5,0), GROUP.PLAYER],
    [pos(0,1), GROUP.ENEMY], [pos(1,1), GROUP.ENEMY], [pos(2,1), GROUP.ENEMY], [pos(3,1), GROUP.PLAYER], [pos(4,1), GROUP.PLAYER], [pos(5,1), GROUP.PLAYER],
    [pos(0,2), GROUP.ENEMY], [pos(1,2), GROUP.ENEMY], [pos(2,2), GROUP.ENEMY], [pos(3,2), GROUP.PLAYER], [pos(4,2), GROUP.PLAYER], [pos(5,2), GROUP.PLAYER]  
])

const PLAYER_ID = 'player'
const createPlayer = () => new Character({id: PLAYER_ID, group: GROUP.PLAYER, position: pos(4,1), hp: 100})
const createEnemy = (state) => new Character({id: state.id, group: GROUP.ENEMY, position: state.position, hp: state.hp})
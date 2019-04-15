'use strict'

const DIRECTION = {
    UP: {x:0, y:-1},
    RIGHT: {x:1, y:0},
    DOWN: {x:0, y:1},
    LEFT: {x:-1, y:0}
}

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    next(direction) {
        return pos(this.x + direction.x, this.y + direction.y)
    }
}

const ALL_POSITIONS = [
    [new Position(0, 0), new Position(1, 0), new Position(2, 0), new Position(3, 0), new Position(4, 0), new Position(5, 0)],
    [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(3, 1), new Position(4, 1), new Position(5, 1)],
    [new Position(0, 2), new Position(1, 2), new Position(2, 2), new Position(3, 2), new Position(4, 2), new Position(5, 2)]
]

const pos = function(x, y) {
    if (x < 0 || x > 5 || y < 0 || y > 2) {
        return undefined
    }
    return ALL_POSITIONS[y][x];
}


const GROUP = {
    PLAYER: {owner: 'player'},
    ENEMY: {owner: 'enemy'}
}

class AreaState {
    constructor(owner, condition) {
        this.owner = owner
        this.condition = condition
    }

    stolenBy(altOwner) {
        return new AreaState(altOwner, this.condition)
    }

    newCondition(condition) {
        return new AreaState(this.owner, condition)
    }
}
const CONDITION = {
    NORMAL: {condition: 'normal'},
    HOLE: {condition: 'hole'}
}
const PLAYER_AREA = new AreaState(GROUP.PLAYER, CONDITION.NORMAL)
const ENEMY_AREA = new AreaState(GROUP.ENEMY, CONDITION.NORMAL)

class Field {
    constructor(areaMap, objectMap) {
        this.areaMap = areaMap;
        this.objectMap = objectMap
    }

    getArea(position) {
        return this.areaMap.get(position)
    }

    getOwner(position) {
        return this.areaMap.get(position).owner
    }

    getObjects(position) {
        return [...this.objectMap.values()].filter((o) => o.position === position)
    }

    stealArea(altOwner, position) {
        const target = this.areaMap.get(position);
        const altMap = patchMap(this.areaMap, position, target.stolenBy(altOwner))
        return this._patchField({areaMap: altMap}, this)
    }

    move(objectId, direction) {
        const target = this.objectMap.get(objectId)
        const toPosition = target.position.next(direction)
        if (!toPosition) {
            return null
        }
        const multiOccupiers = this.getObjects(toPosition).filter((o) => target.isOccupier && o.isOccupier).length > 0

        const targetAreaState = this.getArea(toPosition)
        const falling = targetAreaState.condition === CONDITION.HOLE && !target.isFloating
        const enterable = targetAreaState.owner === target.group

        const valid = !multiOccupiers && !falling && enterable

        if (!valid) {
            return null
        }

        const moved = patchMap(this.objectMap, objectId, target.move(toPosition))
        return this._patchField({objectMap: moved}, this)
    }

    _patchField(altState, oldField) {
        const areaMap = altState.areaMap || oldField.areaMap
        const objectMap = altState.objectMap || oldField.objectMap
        return new Field(areaMap, objectMap)
    }
}

const initArea = (entries) => {
    const area = new Map([
        [pos(0,0), ENEMY_AREA], [pos(1,0), ENEMY_AREA], [pos(2,0), ENEMY_AREA], [pos(3,0), PLAYER_AREA], [pos(4,0), PLAYER_AREA], [pos(5,0), PLAYER_AREA],
        [pos(0,1), ENEMY_AREA], [pos(1,1), ENEMY_AREA], [pos(2,1), ENEMY_AREA], [pos(3,1), PLAYER_AREA], [pos(4,1), PLAYER_AREA], [pos(5,1), PLAYER_AREA],
        [pos(0,2), ENEMY_AREA], [pos(1,2), ENEMY_AREA], [pos(2,2), ENEMY_AREA], [pos(3,2), PLAYER_AREA], [pos(4,2), PLAYER_AREA], [pos(5,2), PLAYER_AREA]  
    ])

    if (typeof entries !== 'undefined' && entries !== null) {
        entries.forEach((e) => area.set(e[0], e[1]))
    }

    return area
}

const initObjects = (objectArray) => new Map(objectArray.map((o) => [o.id, o]))
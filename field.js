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
    constructor(areaMap, occupierMap, effectMap) {
        this.areaMap = areaMap;
        this.occupierMap = occupierMap
        this.effectMap = effectMap
    }

    getArea(position) {
        return this.areaMap.get(position)
    }

    getOwner(position) {
        return this.areaMap.get(position).owner
    }

    getObjectById(objectId) {
        return this.occupierMap.get(objectId) || this.effectMap ? this.effectMap.get(objectId) : null
    }

    getOccupier(position) {
        const found = [...this.occupierMap.values()].filter((o) => o.position === position)

        if (found.length > 1) {
            throw new Error('invalid occupierMap')
        }

        if (found.length === 0) {
            return null
        }

        return found[0]
    }

    getEffects(position) {
        return this.effectMap ? [...this.effectMap.values()].filter(e => e.position === position) : []
    }

    acceptPatch(fieldPatch) {
        const areaMap = fieldPatch.areaMap ? fieldPatch.areaMap.applyTo(this.areaMap) : this.areaMap
        const occupierMap = fieldPatch.occupierMap ? fieldPatch.occupierMap.applyTo(this.occupierMap) : this.occupierMap
        const effectMap = fieldPatch.effectMap ? fieldPatch.effectMap.applyTo(this.effectMap) : this.effectMap

        const positions = new Set([...occupierMap.values()].map((o) => o.position))
        if (positions.size < occupierMap.size) { // invalid
            console.error('invalid status: multi occupier')
            return this
        }

        return new Field(areaMap, occupierMap, effectMap)
    }
}

class FieldPatch {
    constructor(areaMapPatch, occupierMapPatch, effectMapPatch) {
        this.areaMap = areaMapPatch;
        this.occupierMap = occupierMapPatch
        this.effectMap = effectMapPatch
    }
}

class AreaPatch {
    constructor(areaMapPatch) {
        this.areaMap = areaMapPatch;
    }
}

class OccupierPatch {
    constructor(occupierMapPatch) {
        this.occupierMap = occupierMapPatch
    }
}

class EffectPatch {
    constructor(effectMapPatch) {
        this.effectMap = effectMapPatch
    }
}

const NOOPPatch = {}

const initArea = (entries) => {
    const area = new Map([
        [pos(0,0), ENEMY_AREA], [pos(1,0), ENEMY_AREA], [pos(2,0), ENEMY_AREA], [pos(3,0), PLAYER_AREA], [pos(4,0), PLAYER_AREA], [pos(5,0), PLAYER_AREA],
        [pos(0,1), ENEMY_AREA], [pos(1,1), ENEMY_AREA], [pos(2,1), ENEMY_AREA], [pos(3,1), PLAYER_AREA], [pos(4,1), PLAYER_AREA], [pos(5,1), PLAYER_AREA],
        [pos(0,2), ENEMY_AREA], [pos(1,2), ENEMY_AREA], [pos(2,2), ENEMY_AREA], [pos(3,2), PLAYER_AREA], [pos(4,2), PLAYER_AREA], [pos(5,2), PLAYER_AREA]  
    ])

    if (typeof entries !== 'undefined' && entries !== null) {
        return new Patch(entries).applyTo(area)
    }

    return area
}

const initOccupiers = (OccupierArray) => new Map(OccupierArray.map((o) => [o.id, o]))
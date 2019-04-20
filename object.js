'use strict'

class VisibleObjectBase {
    constructor(state) {
        this.id = state.id
        this.group = state.group
        this.position = state.position
        this.isCharacter = state.isCharacter
        this.isOccupier = state.isOccupier
        this.isFloating = state.isFloating
    }

    move(position) {
        const copied = Object.assign({}, this)
        copied.position = position
        return new this.constructor(copied)
    }
}


class Character extends VisibleObjectBase {
    constructor(state) {
        super(state)
        this.hp = state.hp
        this.isCharacter = true
        this.isOccupier = true
        this.isFloating = false
    }

    canEnter(areaState) {
        const own = areaState.owner === this.group
        const falling = areaState.condition === CONDITION.HOLE && !this.isFloating

        return areaState.isFree() && own && !falling
    }
}

const PLAYER_ID = 'player'
const createPlayer = () => new Character({id: PLAYER_ID, group: GROUP.PLAYER, position: pos(4,1), hp: 100})
const createEnemy = (state) => new Character({id: state.id, group: GROUP.ENEMY, position: state.position, hp: state.hp})

class AttackObject extends VisibleObjectBase {
    constructor(state) {
        super(state)
        this.template = state.template
        this.isCharacter = false
        this.isOccupier = false
        this.isFloating = this.template.isFloating
    }

    next(field) {
        return this.template.controller(this, field)
    }
}

class AttackTemplate {
    constructor(state) {
        this.power = state.power
        this.controller = state.controller
        this.isFloating = typeof state.isFloating !== 'undefined' ? state.isFloating : false
    }
}
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

    move(direction) {
        const copied = Object.assign({}, this)
        copied.position = this.position.next(direction)
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
}

const PLAYER_ID = 'player'
const createPlayer = () => new Character({id: PLAYER_ID, group: GROUP.PLAYER, position: pos(4,1), hp: 100})
const createEnemy = (state) => new Character({id: state.id, group: GROUP.ENEMY, position: state.position, hp: state.hp})
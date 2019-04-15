'use strict'

class Character {
    constructor(state) {
        this.id = state.id
        this.group = state.group
        this.position = state.position
        this.hp = state.hp
        this.isCharacter = true
        this.isOccupier = true
        this.isFloating = false
    }

    move(toPosition) {
        return new Character({id: this.id, group: this.group, position: toPosition, hp: this.hp})
    }
}

const PLAYER_ID = 'player'
const createPlayer = () => new Character({id: PLAYER_ID, group: GROUP.PLAYER, position: pos(4,1), hp: 100})
const createEnemy = (state) => new Character({id: state.id, group: GROUP.ENEMY, position: state.position, hp: state.hp})
'use strict'

class Move {
    constructor(objectId, direction, field) {
        this.objectId = objectId
        this.direction = direction
        this.field = field
        this.target = this.field.getObjectById(objectId)
    }

    isValid() {
        const toPosition = this.target.position.next(this.direction)
        if (!toPosition) {
            return false
        }
        const alreadyOccupied = !!this.field.getOccupier(toPosition)

        const targetAreaState = this.field.getArea(toPosition)
        const falling = targetAreaState.condition === CONDITION.HOLE && !this.target.isFloating
        const enterable = targetAreaState.owner === this.target.group

        const valid = !alreadyOccupied && !falling && enterable

        return valid
    }

    toFieldPatch() {
        if (this.isValid()) {
            return new OccupierPatch(new Patch([[this.objectId, this.target.move(this.direction)]]))
        }
        return null
    }
}

class Attack {
    constructor(object) {
        this.object = object
    }

    isValid() {
        return true
    }

    toFieldPatch() {
        if (this.isValid()) {
            return new EffectPatch(new Patch([[this.object.id, this.object]]))
        }
        return null
    }
}

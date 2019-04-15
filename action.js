'use strict'

class Move {
    constructor(objectId, direction, field) {
        this.objectId = objectId
        this.direction = direction
        this.field = field
        this.target = this.field.objectMap.get(objectId)
    }

    isValid() {
        const toPosition = this.target.position.next(this.direction)
        if (!toPosition) {
            return false
        }
        const multiOccupiers = this.field.getObjects(toPosition).filter((o) => this.target.isOccupier && o.isOccupier).length > 0

        const targetAreaState = this.field.getArea(toPosition)
        const falling = targetAreaState.condition === CONDITION.HOLE && !this.target.isFloating
        const enterable = targetAreaState.owner === this.target.group

        const valid = !multiOccupiers && !falling && enterable

        return valid
    }

    toFieldPatch() {
        if (this.isValid()) {
            return new ObjectsPatch(new Patch([[this.objectId, this.target.move(this.direction)]]))
        }
        return null
    }
}
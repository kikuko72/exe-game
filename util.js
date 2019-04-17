'use strict'

class Patch {
    constructor(entries) {
        this.entries = entries
    }

    applyTo(map) {
        const altMap = new Map(map ? [...map.entries()] : [])
        this.entries.forEach((e) => altMap.set(e[0], e[1]))
        return altMap
    }

    merge(another) {
        return new Patch(this.entries.concat(another.entries))
    }
}
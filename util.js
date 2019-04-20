'use strict'

class Patch {
    constructor(entries) {
        this.entries = entries
    }

    applyTo(map) {
        const oldEntries = map ? [...map.entries()] : []
        const altMap = new Map(oldEntries)
        this.entries.forEach(e => altMap.set(e[0], e[1]))
        return altMap
    }

    merge(another) {
        return new Patch(this.entries.concat(another.entries))
    }
}

class PairingPatch {
    constructor(entries) {
        this.entries = entries
        this.values = new Set()
        entries.forEach(e => this.values.add(e[1]))
    }

    applyTo(map) {
        const oldEntries = map ? [...map.entries()] : []
        const altMap = new Map(oldEntries.filter(e => !this.values.has(e[1])))
        this.entries.forEach(e => altMap.set(e[0], e[1]))
        return altMap
    }
}
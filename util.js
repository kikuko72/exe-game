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

class InjectiveMap {
    constructor(entries) {
        this.map = new Map(entries)
        const codomain = new Set()
        entries.forEach(e => codomain.add(e[1]))
        this.mappedCodomain = codomain
    }

    applyPatch(entry) {
        const domain = entry[0]
        const codomain = entry[1]

        if (this.mappedCodomain.has(codomain)) {
            return this.map.get(domain) === codomain ? this : undefined
        }

        const altEntries = [...this.map.entries()].map(e => e[0] === domain ? [domain, codomain] : e)
        return new InjectiveMap(altEntries)
    }
}
'use strict'

const patchMap = (srcMap, key, value) => {
    const altMap = new Map([...srcMap.entries()])
    altMap.set(key, value)
    return altMap
}
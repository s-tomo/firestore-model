import 'reflect-metadata'
import { plural } from 'pluralize'

export const M: Map<{ new() }, any> = new Map

function inject(collection: { new() }, path, value) {
  let metadata = M.get(collection)
  if (!metadata) {
    metadata = {}
    M.set(collection, metadata)
  }
  let ob = metadata
  let nodes = path.split('.')
  let key = nodes.pop()
  for (let node of nodes) {
    if (!ob[node]) {
      ob[node] = {}
    } else if (typeof ob[node] !== 'object') {
      throw new Error
    }
    ob = ob[node]
  }
  if (key === '*') {
    if (!ob[key]) {
      ob[key] = []
    } else if (!(ob[key] instanceof Array)) {
      throw new Error
    }
    ob[key].push(value)
  } else {
    ob[key] = value
  }
}

function relate(collection: { new() }, sub: { new() }) {
  if (!M.has(sub)) {
    throw new Error
  }
  inject(collection, 'subCollectionNames.*', sub)
}

export function collection() {
  return function (target: { new() }) {
    let name = plural(target.name.toLowerCase())
    inject(target, 'name', name)
  }
}

export function field(target, key: string): void {
  let type = Reflect.getMetadata('design:type', target, key).name.toLowerCase()
  if (type === 'boolean') {
    type = 'bool'
  }
  inject(target.constructor, `fields.${key}.type`, type)
}

export function readonly(target, key: string) {
  inject(target.constructor, `fields.${key}.readonly`, true)
}

export function contains(list: any[]) {
  return function (target, key: string) {
    inject(target.constructor, `fields.${key}.contains`, list)
  }
}

export function sub() {
  return function (target, key: string) {
    let collection = Reflect.getMetadata('design:type', target, key)

  }
}

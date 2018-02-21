import 'reflect-metadata'
import { plural } from 'pluralize'
import { CollectionClass, inject, has } from './metadata'

export function collection() {
  return function (Collection: CollectionClass) {
    let name = plural(Collection.name.toLowerCase())
    inject(Collection, 'name', name)
  }
}

export function field(target, key: string): void {
  let type = Reflect.getMetadata('design:type', target, key)
    .name
    .toLowerCase()
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
    let SubCollection = Reflect.getMetadata('design:type', target, key)
    if (!has(SubCollection)) {
      throw new Error(`${SubCollection.name} class is not collection`)
    }
    inject(target.constructor, 'subCollections.*', SubCollection)
  }
}

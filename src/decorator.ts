import 'reflect-metadata'
import { plural } from 'pluralize'
import { CollectionClass, inject, has } from './metadata'

export function collection() {
  return function (Collection: CollectionClass) {
    let name = plural(Collection.name.toLowerCase())
    inject(Collection, 'name', name)
  }
}

export function field(collection, key: string): void {
  let type = Reflect.getMetadata('design:type', collection, key).name.toLowerCase()
  if (type === 'boolean') {
    type = 'bool'
  }
  inject(collection.constructor, `fields.${key}.type`, type)
}

export function readonly(collection, key: string) {
  inject(collection.constructor, `fields.${key}.readonly`, true)
}

export function contains(list: any[]) {
  return function (collection, key: string) {
    inject(collection.constructor, `fields.${key}.contains`, list)
  }
}

export function sub() {
  return function (collection, key: string) {
    let SubCollection = Reflect.getMetadata('design:type', collection, key)
    if (!has(SubCollection)) {
      throw new Error(`${SubCollection.name} class is not collection`)
    }
    inject(collection.constructor, 'subCollections.*', SubCollection)
  }
}

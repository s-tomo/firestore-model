import 'reflect-metadata'
import { plural } from 'pluralize'
import { CollectionClass, inject } from './metadata'

export interface CollectionDecoratorOptions {
  name?: string
  idAlias?: string
  id?: any
  subs?: CollectionClass[]
}

function camelize(str: string): string {
  return str
    .replace(/(_.)/g, c => c.charAt(1).toUpperCase())
    .replace(/^([A-Z])/, c => c.toLowerCase())
}

export function collection(opts: string | CollectionDecoratorOptions = {}) {
  return function (Collection: CollectionClass) {
    let camelizedName = camelize(Collection.name)
    if (typeof opts === 'string') {
      opts = { name: opts }
    }
    inject(Collection, 'name', opts.name || plural(camelizedName))
    inject(Collection, 'idAlias', opts.idAlias || `${camelizedName}Id`)
    if (opts.id) {
      inject(Collection, 'id', opts.id)
    }
    if (opts.subs) {
      inject(Collection, 'subs', opts.subs)
    }
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

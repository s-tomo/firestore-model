import 'reflect-metadata'

export interface CollectionClass { new() }

export type CollectionsMetadata = Map<CollectionClass, CollectionMetadata>

export interface CollectionMetadata {
  name: string
  idName?: string
  fields: { [name: string]: FieldMetadata }
  subCollectionNames?: CollectionClass[]
}

export interface FieldMetadata {
  type: 'string' | 'int' | 'float' | 'bool' | 'list' | 'map'
}

const metadataKey = Symbol('firestore')

export function hasMetadata(collection: CollectionClass) {
  return Reflect.hasMetadata(metadataKey, collection)
}

export function getMetadata(collection: CollectionClass) {
  return Reflect.getMetadata(metadataKey, collection)
}

export function inject(collection: CollectionClass, path, value) {
  let metadata = Reflect.getMetadata(metadataKey, collection)
  if (!metadata) {
    metadata = {}
    Reflect.defineMetadata(metadataKey, metadata, collection)
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
  ob[key] = value
}

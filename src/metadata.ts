export type Collection = { new() }

export type CollectionsMetadata = Map<Collection, CollectionMetadata>

export interface CollectionMetadata {
  name: string
  idName?: string
  fields: { [name: string]: FieldMetadata }
  subCollectionNames?: Collection[]
}

export interface FieldMetadata {
  type: 'string' | 'int' | 'float' | 'bool' | 'list' | 'map'
}
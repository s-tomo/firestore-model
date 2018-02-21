import { CollectionClass, CollectionsMetadata } from './metadata'

export interface Line {
  0: number
  1?: string
  [Symbol.iterator](): IterableIterator<string | number>
}

const INDENT = 2
const NO_INDENT = 0

export function compile(
  root: CollectionClass[],
  metadataMap: CollectionsMetadata,
) {
  let code: Line[] = []
  code.push(
    [NO_INDENT, 'service cloud.firestore {'],
    [INDENT, 'match /databases/{database}/documents {'],
  )
  for (let collection of root) {
    code.push(
      ...shift([
        [NO_INDENT],
        ...compileCollection(collection, metadataMap),
      ], 2),
    )
  }
  code.push(
    ...shift([
      [NO_INDENT],
      [NO_INDENT, '/{documet=**} {'],
      [INDENT, 'read, write: if false;'],
      [NO_INDENT, '}'],
    ], 2),
    [INDENT, '}'],
    [NO_INDENT, '}'],
  )
  return code
}

export function shift(code: Line[], pow: number = 1): Line[] {
  for (let line of code) {
    line[0] += INDENT * pow
  }
  return code
}

export function compileCollection(
  collection: CollectionClass,
  metadataMap: CollectionsMetadata,
) {
  let metadata = metadataMap.get(collection)
  let code: Line[] = []
  code.push([NO_INDENT, `/${metadata.name}/{${metadata.idName}} {`])
  if (metadata.subCollectionNames) {
    for (let subName of metadata.subCollectionNames) {
      code.push(
        ...shift([
          [NO_INDENT],
          ...compileCollection(subName, metadataMap),
        ]),
      )
    }
  }
  code.push([NO_INDENT, '}'])
  return code
}

export function compileField() {
  //
}

export function stringify(code: Line[]): string {
  return code
    .map(([n, line]: Line) => `${Array(n).fill(' ').join('')}${line || ''}`)
    .join('\n')
}

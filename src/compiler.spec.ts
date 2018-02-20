import * as assert from 'power-assert'
import { compile, format } from './compiler'
import { CollectionsMetadata } from './metadata'

const collections: CollectionsMetadata = {
  foo: {
    idName: 'fooId',
    fields: {
      a: { type: 'string' },
    },
    subCollectionNames: ['bar'],
  },
  bar: {
    idName: 'barId',
    fields: {
      b: { type: 'string' },
    },
  }
}

describe('compile module', () => {
  it('#compile', () => {
    let actual = compile(['foo'], collections)
    console.log(format(actual))
  })
})

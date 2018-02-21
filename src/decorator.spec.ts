import * as assert from 'power-assert'
import 'reflect-metadata'
import * as deco from './decorator'
import { getMetadata, CollectionClass } from './metadata'

describe('decorator module', () => {
  let Collection: CollectionClass

  beforeEach(() => {
    Collection = class TestSample { }
  })

  it('should #collection saves plural camelized name', () => {
    deco.collection()(Collection)
    assert(getMetadata(Collection).name === 'testSamples')
  })

  it('should #field saves value type', () => {
    let collection = new Collection, key = 'name'
    Reflect.defineMetadata('design:type', String, collection, key)
    deco.field(collection, key)
    assert(getMetadata(Collection).fields.name.type === 'string')
  })

  it('should #readonly set readonly flat to true', () => {
    let collection = new Collection, key = 'status'
    deco.readonly(collection, key)
    assert(getMetadata(Collection).fields.status.readonly === true)
  })

  it('should #contains save list of key-value', () => {
    let collection = new Collection, key = 'lang'
    deco.contains(['jp', 'en'])(collection, key)
    assert.deepEqual(getMetadata(Collection).fields.lang.contains, ['jp', 'en'])
  })
})

import * as assert from 'power-assert'
import 'reflect-metadata'
import * as deco from './decorator'
import { get, CollectionClass } from './metadata'

describe('decorator module', () => {
  let Collection: CollectionClass

  beforeEach(() => {
    Collection = class Test { }
  })

  it('should #collection saves pluralized name', () => {
    deco.collection()(Collection)
    assert(get(Collection).name === 'tests')
  })

  it('should #field saves value type', () => {
    let collection = new Collection, key = 'name'
    Reflect.defineMetadata('design:type', String, collection, key)
    deco.field(collection, key)
    assert(get(Collection).fields.name.type === 'string')
  })

  it('should #readonly set readonly flat to true', () => {
    let collection = new Collection, key = 'status'
    deco.readonly(collection, key)
    assert(get(Collection).fields.status.readonly === true)
  })

  it('should #contains save list of key-value', () => {
    let collection = new Collection, key = 'lang'
    deco.contains(['jp', 'en'])(collection, key)
    assert.deepEqual(get(Collection).fields.lang.contains, ['jp', 'en'])
  })

  it('should #sub throws exception when sub collection is not injected', () => {
    let collection = new Collection, key = 'sub', Sub = class Sub { }
    Reflect.defineMetadata('design:type', Sub, collection, key)
    assert.throws(() => {
      deco.sub()(collection, key)
    })
  })

  it('should #sub append sub collection into subCollections list', () => {
    let collection = new Collection, key = 'sub', Sub = class Sub { }
    Reflect.defineMetadata('design:type', Sub, collection, key)
    deco.collection()(Sub)
    deco.sub()(collection, key)
    assert(get(Collection).subCollections[0] === Sub)
  })
})

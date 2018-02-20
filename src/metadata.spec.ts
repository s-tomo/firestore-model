import * as assert from 'power-assert'
import 'reflect-metadata'
import { has, get, inject, CollectionClass } from './metadata'

describe('metadata module', () => {
  let target: CollectionClass

  beforeEach(() => {
    target = class { }
  })

  it('should #has returns false when object is not injected', () => {
    assert(has(target) === false)
  })

  it('should #inject saves value into metadata', () => {
    inject(target, 'foo.bar', 479854)
    assert(get(target).foo.bar === 479854)
  })

  it('should #inject push value into array use *', () => {
    inject(target, 'hoge.*', 'piyo')
    assert(get(target).hoge[0] === 'piyo')
  })

  it('should #has returns true when object is injected', () => {
    inject(target, 'hoge', 'hogehoge')
    assert(has(target) === true)
  })
})

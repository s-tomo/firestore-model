import * as assert from 'power-assert'
import 'reflect-metadata'
import { hasMetadata, getMetadata, inject, CollectionClass } from './metadata'

describe('metadata module', () => {
  let target: CollectionClass

  beforeEach(() => {
    target = class { }
  })

  it('should #has returns false when object is not injected', () => {
    assert(hasMetadata(target) === false)
  })

  it('should #inject saves value into metadata', () => {
    inject(target, 'foo.bar', 479854)
    assert(getMetadata(target).foo.bar === 479854)
  })

  it('should #has returns true when object is injected', () => {
    inject(target, 'hoge', 'hogehoge')
    assert(hasMetadata(target) === true)
  })
})

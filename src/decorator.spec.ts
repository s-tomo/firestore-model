import { int } from './type'
import { field, contains, readonly, collection, M } from './decorator'

@collection()
class Human {
  @field
  name: string

  @field
  age: int

  @field
  @contains(['male', 'female'])
  sex: string = 'male'

  @field
  @readonly
  alive: boolean
}

console.dir(M.get(Human))

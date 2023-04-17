import { randomUUID } from 'crypto'

export default class User {
  id: string
  name: string
  age: number
  height: number
  weight: number

  constructor(name: string, age: number, heigth: number, weight: number) {
    this.id = randomUUID()
    this.name = name
    this.age = age
    this.height = heigth
    this.weight = weight
  }
}

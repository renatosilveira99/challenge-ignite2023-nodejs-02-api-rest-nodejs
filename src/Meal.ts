import { randomUUID } from 'crypto'

export default class Meal {
  id: string
  name: string
  description: string
  date: string
  hour: string
  isHealthyMeal: boolean
  userId: string

  constructor(
    name: string,
    description: string,
    date: string,
    hour: string,
    isHealthyMeal: boolean,
    userId: string,
  ) {
    this.id = randomUUID()
    this.name = name
    this.description = description
    this.date = date
    this.hour = hour
    this.isHealthyMeal = isHealthyMeal
    this.userId = userId
  }
}

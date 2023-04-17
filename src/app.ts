import fastify, { FastifyRequest, FastifyReply } from 'fastify'

import User from './User'
import Meal from './Meal'

export const app = fastify()

const users: User[] = []
const meals: Meal[] = []

function verifyAuthorization(
  request: FastifyRequest,
  reply: FastifyReply,
  next: (err?: Error) => void,
) {
  const { userId: paramsUserId } = request.params as any
  const { userId: queryUserId } = request.query as any

  const userHasMeals = meals.some(
    (meal) => meal.userId === paramsUserId || queryUserId,
  )

  if (!userHasMeals) {
    return reply
      .status(404)
      .send({ message: ' User not found or user has no meals' })
  }

  next()
}

app.post('/users/create', (request: FastifyRequest, reply: FastifyReply) => {
  const { name, age, height, weight } = request.body as any

  const user = new User(name, age, height, weight)

  users.push(user)

  return reply.status(200).send({ user })
})

app.get(
  '/users/metrics/:userId',
  (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.params as any

    const user = users.find((user) => user.id === userId)

    if (!user) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const userMeals = meals.filter((meal) => meal.userId === userId)

    const totalMeals = userMeals.length

    const totalHealthyMeals = userMeals.filter(
      (meal) => meal.isHealthyMeal === true,
    ).length

    const totalUnhealthyMeals = userMeals.filter(
      (meal) => meal.isHealthyMeal === false,
    ).length

    return reply.status(200).send({
      totalMeals,
      totalHealthyMeals,
      totalUnhealthyMeals,
    })
  },
)

app.post('/meals/create', (request: FastifyRequest, reply: FastifyReply) => {
  const { name, description, date, hour, isHealthyMeal, userId } =
    request.body as any

  const meal = new Meal(name, description, date, hour, isHealthyMeal, userId)

  meals.push(meal)

  return reply.status(200).send({ meal })
})

app.get(
  '/meals/list/:userId',
  { preHandler: verifyAuthorization },
  (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.params as any

    const userMeals = meals.filter((meal) => meal.userId === userId)

    return reply.status(200).send({ userMeals })
  },
)

app.get(
  '/meals/:mealId',
  { preHandler: verifyAuthorization },
  (request: FastifyRequest, reply: FastifyReply) => {
    const { mealId } = request.params as any

    const meal = meals.find((meal) => meal.id === mealId)

    return reply.status(200).send({ meal })
  },
)

app.patch(
  '/meals/:mealId',
  { preHandler: verifyAuthorization },
  (request: FastifyRequest, reply: FastifyReply) => {
    const { mealId } = request.params as any
    const { name, description, date, hour, isHealthyMeal } = request.body as any

    const mealIndex = meals.findIndex((meal) => meal.id === mealId)

    if (mealIndex === -1) {
      return reply.status(404).send({ message: 'Meal not found' })
    }

    meals[mealIndex].name = name
    meals[mealIndex].description = description
    meals[mealIndex].date = date
    meals[mealIndex].hour = hour
    meals[mealIndex].isHealthyMeal = isHealthyMeal

    return reply.status(200).send({ meal: meals[mealIndex] })
  },
)

app.delete(
  '/meals/:mealId',
  { preHandler: verifyAuthorization },
  (request: FastifyRequest, reply: FastifyReply) => {
    const { mealId } = request.params as any

    const mealIndex = meals.findIndex((meal) => meal.id === mealId)

    if (mealIndex === -1) {
      return reply.status(404).send({ message: 'Meal not found' })
    }

    meals.splice(mealIndex, 1)

    return reply.status(200).send({ message: 'Meal deleted' })
  },
)

app.setErrorHandler((error, _, reply) => {
  console.log(JSON.stringify(error))

  return reply.status(500).send({ message: 'Internal Server Error' })
})

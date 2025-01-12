/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findONeById(createdCard.insertedId)
    return getNewCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew
}
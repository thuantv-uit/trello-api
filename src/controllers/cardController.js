import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const CreateNew = async (req, res, next) => {
  try {
    const createCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ createCard })
  } catch (error) { next(error) }
}

export const cardController = {
  CreateNew
}
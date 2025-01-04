import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'

const CreateNew = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const createBoard = await boardService.createNew(req.body)

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json({ createBoard })
  } catch (error) { next(error) }
}

export const boardController = {
  CreateNew
}
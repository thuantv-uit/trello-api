import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

// Note: Mặc định chúng ta không phải custom message ở phía BE làm gì vì để cho Front-end tự validate và custom message phía FE cho đẹp.
// Back-end: chỉ cần Validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được.
// Quan trọng: Việc Validate dữ liệu là BẮT BUỘC phải có ở phía Back-end vù đây là điểm cuối để lưu trữ dữ liệu vào Database.
// Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả Back-end và Front-end.
const CreateNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.required': 'Title is not allowed to be empty',
      'string.min': 'Title length must be at least 3 character long',
      'string.max': 'Title length must be less than or equal to 50 character long',
      'string.trim': 'Title must not have leading or trailing whitespace'

    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })

  try {
    // Set abortEarly: false để trường hợp có nhiều lỗi Validation thì trả về tất cả
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // validate dữ liệu hợp lệ thì cho request đi tiếp sang Controller
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}
export const boardValidation = {
  CreateNew
}
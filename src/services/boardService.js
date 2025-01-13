/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // Gọi tới tầng Model để xử lý bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)
    // Lấy bản ghi board sau kho gọi (tùy chọn mục đích dự án mà cần bước này hay không)
    const getNewBoard = await boardModel.findONeById(createdBoard.insertedId)
    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án...
    // Bắn email, notification về cho admin khi có 1 cái board được tạo...

    // Trả kết quả về, trong Service luôn phải có return
    return getNewBoard
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    // Deep Clone board ra một cái mới để xử lý, không ảnh hưởng tới board ban đầu, tùy mục đích về sau mà có cần clone deep hay không
    const resBoard = cloneDeep(board)
    // Đưa card về đúng Column
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    // XÓa mảng cards khỏi board ban đầu
    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

// const getDetails = async (boardId) => {
//   try {
//     const board = await boardModel.getDetails(boardId)
//     if (!board) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
//     }
//     return board
//   } catch (error) { throw error }
// }

export const boardService = {
  createNew,
  getDetails
}
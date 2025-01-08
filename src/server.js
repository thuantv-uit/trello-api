/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  // Xử lý cors
  app.use(cors(corsOptions))

  // Enble req.body json data
  app.use(express.json())
  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.APP_HOST} and Port :${env.APP_PORT}`)
  })
  // Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Server is shutting...')
    CLOSE_DB
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

// Chỉ khi kết nối tới Database thành công thì mới Start Server Back-end lên
//  Immediately-invoked / Anonymous Async Functions (IIFE)
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas!')
    await CONNECT_DB()
    console.log('2. Connected to MongoDb Cloud Atlas!')
    // Khởi động Server Back-end khi connect Database thành công
    START_SERVER()
  }
  catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    console.log(await GET_DB(). listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`3. Hello Thuan, Back-end Server is running successfully at Host: ${hostname} and Port :${port}`)
  })
  // Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Disconnecting from MongoDB CLoud Atlas')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB CLoud Atlas')

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

// Cách viết thứ 2
// console.log('1. Connecting to MongoDB Cloud Atlas!')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDb Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
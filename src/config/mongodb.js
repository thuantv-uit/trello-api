// abc
const MONGODB_URI = 'mongodb+srv://thuan:VwD7DuwQlFrW4GYj@cluster0.o3ck5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const DATABASE_NAME = 'trello-thuandev-mern'

import { MongoClient, ServerApiVersion } from 'mongodb'
// Khởi tạo  một đối tượng trelloDatabaseInstance ban đầu là null (chưa connect)
let trelloDatabaseInstance = null
// Khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// kết nối tới Database
export const CONNECT_DB = async () => {
  // Gọi kết nối tới MongDB Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()
  // Kết nối thành công thì lấy ra Database theo tên và gán ngược nói lại vào biến trelloDatabaseInstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

// Function GET_DB (không async) này có nhiệm vụ export ra trelloDatabaseInstance sau khi connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code.
// Lưu ý phải đảm bảo chỉ luôn được gọi DB này sau khi đã kết nối thành công tới MongoDB.
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error ('Must connect to Database first')
  return trelloDatabaseInstance
}
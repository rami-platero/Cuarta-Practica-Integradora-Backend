import 'dotenv/config'

export const config = {
  productsPath: "./src/dao/FileSystem/files/products.json",
  cartsPath: "./src/dao/FileSystem/files/carts.json",
  MONGODB_URI: process.env.MONGODB_URI
};

import 'dotenv/config'

export const config = {
  productsPath: "./src/dao/FileSystem/files/products.json",
  cartsPath: "./src/dao/FileSystem/files/carts.json",
  MONGODB_URI: process.env.MONGODB_URI,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  SESSION_SECRET_CODE: process.env.SESSION_SECRET_CODE
};

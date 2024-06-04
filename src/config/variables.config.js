import 'dotenv/config'
import program from './commander.config.js';

export const config = {
  productsPath: "./src/dao/FileSystem/files/products.json",
  cartsPath: "./src/dao/FileSystem/files/carts.json",
  MONGODB_URI: process.env.MONGODB_URI,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  SESSION_SECRET_CODE: process.env.SESSION_SECRET_CODE,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  persistence: program.opts().persist,
  environment: program.opts().mode,
  mailing: {
    user: process.env.MAILING_USER,
    service: process.env.MAILING_SERVICE,
    password: process.env.MAILING_PASSWORD
  },
  port: process.env.PORT || 8080,
  BASE_URL: process.env.BASE_URL
};

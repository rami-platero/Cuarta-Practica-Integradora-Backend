import { cartsDao, messageDao, productDao, userDao } from "./factory.js";
import CartsRepository from "./repositories/carts.repository.js";
import MessageRepository from "./repositories/message.repository.js";
import ProductRepository from "./repositories/product.repository.js";
import UserRepository from "./repositories/user.repository.js";

export const userService = new UserRepository(userDao)
export const productService = new ProductRepository(productDao)
export const cartsService = new CartsRepository(cartsDao, productService)
export const messageService = new MessageRepository(messageDao)
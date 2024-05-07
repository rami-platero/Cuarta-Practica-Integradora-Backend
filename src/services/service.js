import { cartsDao, messageDao, productDao, ticketDao, userDao } from "./factory.js";
import CartsRepository from "./repositories/carts.repository.js";
import MessageRepository from "./repositories/message.repository.js";
import ProductRepository from "./repositories/product.repository.js";
import TicketRepository from "./repositories/ticket.repository.js";
import UserRepository from "./repositories/user.repository.js";

export const userService = new UserRepository(userDao)
export const productService = new ProductRepository(productDao)
export const ticketService = new TicketRepository(ticketDao)
export const cartsService = new CartsRepository(cartsDao, productService, ticketService)
export const messageService = new MessageRepository(messageDao)
import { config } from "../config/variables.config.js";
import { initMongoConnection } from "./dao/mongo/db.js"

export let productDao, cartsDao, userDao, messageDao, ticketDao;

switch (config.persistence) {
  case "mongodb":
    initMongoConnection();
    const { default: ProductMongo } = await import(
      "./dao/mongo/classes/product.dao.js"
    );
    productDao = new ProductMongo;

    const { default: MessageMongo } = await import(
      "./dao/mongo/classes/message.dao.js"
    );
    messageDao = new MessageMongo;

    const { default: CartsMongo } = await import(
      "./dao/mongo/classes/carts.dao.js"
    );
    cartsDao = new CartsMongo;

    const { default: UserMongo } = await import(
      "./dao/mongo/classes/user.dao.js"
    );
    userDao = new UserMongo;

    const {default: TicketMongo} = await import('./dao/mongo/classes/ticket.dao.js')
    ticketDao = new TicketMongo
    break;

  default:
    break;
}

import { config } from "../config/variables.config.js";
import { initMongoConnection } from "./dao/mongo/db.js"

export let productDao, cartsDao, userDao, messageDao;

switch (config.persistence) {
  case "mongodb":
    initMongoConnection();
    const { default: ProductMongo } = await import(
      "../services/dao/mongo/classes/product.dao.js"
    );
    productDao = new ProductMongo;

    const { default: MessageMongo } = await import(
      "../services/dao/mongo/classes/message.dao.js"
    );
    messageDao = new MessageMongo;

    const { default: CartsMongo } = await import(
      "../services/dao/mongo/classes/carts.dao.js"
    );
    cartsDao = new CartsMongo;

    const { default: UserMongo } = await import(
      "../services/dao/mongo/classes/user.dao.js"
    );
    userDao = new UserMongo;
    break;

  default:
    break;
}

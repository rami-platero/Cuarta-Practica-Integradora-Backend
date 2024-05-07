import Cart from "../models/cart.model.js";

export default class CartsMongo {
  create = async () => {
    return await Cart.create();
  };
  findAll = async () => {
    const carts = await Cart.find().lean(true);
    return carts.map((c) => c.toObject());
  };
  findById = async (id) => {
    return await Cart.findById(id, {}, { lean: true }).populate(
      "products.product"
    );
  };

  addItem = async (cid, pid) => {
    return await Cart.findByIdAndUpdate(
      cid,
      {
        $push: {
          products: {
            quantity: 1,
            product: pid,
          },
        },
      },
      { new: true, lean: true }
    )
  };

  removeItem = async (cid, pid) => {
    return await Cart.updateOne(
      { _id: cid },
      {
        $pull: {
          products: {
            product: pid,
          },
        },
      }
    );
  };

  increaseItemQuantity = async (cid, pid) => {
    return await Cart.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      {
        $inc: {
          "products.$.quantity": 1,
        },
      },
      { new: true, lean: true }
    )
  };

  clearCart = async (cid) => {
    return await Cart.updateOne(
      { _id: cid },
      {
        $set: {
          products: [],
        },
      }
    );
  };

  findOneAndUpdateQuantity = async ({ cid, pid }, newQuantity) => {
    return await Cart.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      {
        $set: {
          "products.$.quantity": newQuantity,
        },
      },
      { new: true, lean: true }
    )
  };

  findOneAndUpdateProducts = async (id) => {
    return await Cart.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          products,
        },
      },
      { new: true, lean: true }
    )
  };
}

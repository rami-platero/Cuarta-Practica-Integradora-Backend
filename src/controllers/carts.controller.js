import CartService from "../dao/database/services/carts.service.js";

export const createCart = async (_req, res, next) => {
  try {
    const newCart = await CartService.createCart();

    return res
      .status(201)
      .json({ message: "Created cart successfully.", payload: newCart });
  } catch (error) {
    return next(error);
  }
};

export const getAllCarts = async (_req, res, next) => {
  try {
    const carts = await CartService.getAllCarts();

    return res.status(200).send(carts);
  } catch (error) {
    return next(error);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await CartService.addProductToCart({ cid, pid });

    return res
      .status(201)
      .json({
        message: "Product added to cart successfully!",
        payload: updatedCart,
      });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

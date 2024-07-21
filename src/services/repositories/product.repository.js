import { AppError } from "../../helpers/AppError.js";
import { generateProduct } from "../../utils/faker.js";
import { sendMail } from "../email/mailing.service.js";
import { EErrors } from "../errors/enums.js";
import { userService } from "../service.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createProduct = async (body, thumbnails) => {
    return await this.dao.create({
      title: body.title,
      category: body.category,
      code: body.code,
      description: body.description,
      price: body.price,
      status: body.status,
      stock: body.stock,
      thumbnails: thumbnails,
      owner: body.owner,
    });
  };

  updateProduct = async (upFields, id) => {
    return await this.dao.findByIdAndUpdate(id, upFields);
  };

  updateProductStock = async (id, newStock) => {
    return await this.dao.updateStock(id, newStock);
  };

  deleteProduct = async (id, user) => {
    const foundProduct = await this.dao.findById(id);
    if (!foundProduct) {
      throw new AppError({
        name: "Delete product error.",
        message: "Error while trying to delete product.",
        code: EErrors.NOT_FOUND,
        cause: `The product you are trying to delete does not exist!`,
      });
    }
    if (user.role !== "admin" && foundProduct.owner !== user.email) {
      throw new AppError({
        name: "Delete product error.",
        message: "Error while trying to delete product.",
        code: EErrors.UNAUTHORIZED,
        cause: `You are not authorized to delete this product.`,
      });
    }
    const foundOwner = await userService.getUser({ email: owner });
    if (foundOwner && foundOwner.role === "premium") {
      await sendMail({
        targetUser: foundOwner.email,
        subject: "Your product has been removed.",
        html: `
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
    <div style="text-align: center; padding: 10px 0;">
        <h1 style="margin: 0; color: #d9534f;">Product Removed</h1>
    </div>
    <div style="margin-top: 20px;">
        <p>Dear User,</p>
        <p>We regret to inform you that one of your products has been removed from our system. Below are the details of the removed product:</p>
        <div style="margin-top: 20px; padding: 10px; border: 1px solid #ddd; background-color: #fff; border-radius: 5px;">
            <p style="margin: 5px 0;"><strong>Title:</strong> ${foundProduct.title}</p>
            <p style="margin: 5px 0;"><strong>Description:</strong> ${foundProduct.description}</p>
            <p style="margin: 5px 0;"><strong>Code:</strong> ${foundProduct.code}</p>
            <p style="margin: 5px 0;"><strong>Stock:</strong> ${foundProduct.stock}</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> $${foundProduct.price}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${foundProduct.category}</p>
        </div>
        <p>If you have any questions or need further assistance, please feel free to contact us.</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #777;">
        <p>Thank you for your understanding.</p>
    </div>
</body>
`,
      });
    }
    return await this.dao.deleteOneById(id);
  };

  getAllProducts = async () => {
    return await this.dao.findAll();
  };

  getProductById = async (id) => {
    return await this.dao.findById(id);
  };

  getProducts = async ({ limit, page = 1, query, sort }) => {
    // @ts-ignore
    return await this.dao.getPaginated(
      { title: { $regex: query, $options: "i" } },
      {
        limit,
        page,
        sort,
      }
    );
  };

  getMockingProducts = async (amount = 100) => {
    const mockingproducts = [];
    for (let i = 0; i < amount; i++) {
      const generatedProduct = generateProduct();
      mockingproducts.push(generatedProduct);
    }
    return mockingproducts;
  };
}

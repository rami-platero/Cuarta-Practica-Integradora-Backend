import { Document, Types } from "mongoose";

interface Cart extends Document{
    products: Array<{
      quantity: number;
      product: Product | Types.ObjectId
    }>;
}
  
interface Product {
    title: string;
    description: string;
    code: string;
    stock: number;
    price: number;
    category: string;
    status?: boolean;
    thumbnails?: string[];
}

export {Product, Cart}
import { connect } from "mongoose";
import { config } from "../../config.js";

export const connectDB = async () => {
  try {
    // @ts-ignore
    await connect(config.MONGODB_URI);
    console.log("connected to db");
  } catch (error) {
    console.log("couldn't connect to server");
  }
};

import mongoose from "mongoose";
import { logger } from "../../../logger";

const URL =
  "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce?retryWrites=true&w=majority";

export const connectCloudDB = () => {
  try {
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.log("info", "Base de datos conectada!");
  } catch (error) {
    logger.log("error", "Error al conectar a DB: ", error);
  }
};

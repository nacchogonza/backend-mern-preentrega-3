import mongoose from "mongoose";
import { logger } from "../../../logger";

const URL = process.env.MONGO_URL;

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

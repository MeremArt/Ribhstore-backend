import mongoose from "mongoose";
mongoose.set("strictQuery", true);
import logger from "../middlewares/logger.middleware";
import { MESSAGES } from "./constants.config";

export default function connectToMongo() {
  mongoose.connect(process.env.DB_URI!)
    .then(() => {
      logger.info(MESSAGES.DATABASE.CONNECTED);
    })
    .catch((err) => {
      logger.error(MESSAGES.DATABASE.ERROR, err);
    }
    );
}
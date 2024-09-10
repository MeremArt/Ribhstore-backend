import app from "./app";
import logger from "./middlewares/logger.middleware";
import { PORT } from "./configs/constants.config"
import connectToMongo from "./configs/database.config"

(async () => {
  logger.info(`Attempting to run server on port ${PORT}`);
  connectToMongo();
  app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
  });
})();
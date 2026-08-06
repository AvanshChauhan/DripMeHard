import app from "./src/app.js";
import { config } from "./config/config.js";
import { connectToDb } from "./config/database.js";

const startServer = async () => {
  try {
    await connectToDb();

    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

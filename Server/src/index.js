const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const databaseConnect = require("./database");
require("dotenv").config(); // Load environment variab

const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await databaseConnect(); // Database connection

    const corsOptions = {
      origin: "https://autentication-and-autorization.vercel.app" || "http://localhost:5173", // Set client URL for CORS
      methods: "GET,POST,PUT,DELETE,OPTIONS",
      allowedHeaders: "Content-Type,Authorization",
      credentials: true,
      httpOnly: true,
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());
    app.use("/api", routes);

    app.get("/", (req, res) => {
      const serverUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${port}`;

      res.json({
        message: "Server is running",
        serverLink: serverUrl,
        databaseStatus: "Connected", // Assuming databaseConnect() does not throw an error if successful
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(err.status || 500).send({ error: err.message || "Internal Server Error" });
    });

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

module.exports = startServer;

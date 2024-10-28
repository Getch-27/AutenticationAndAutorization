const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const databaseConnect = require("./database");

const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await databaseConnect(); // Database connection

    app.use( // Handle CORS requests
      cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: "Content-Type,Authorization",
        credentials: true, 
        httpOnly: true
      })
    );

    app.use(express.json());
    app.use(cookieParser());
    app.use("/api", routes);

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

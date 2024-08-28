const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const databaseConnect = require("./database");

const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
  await databaseConnect(); // database connection

  app.use( // handle CORS requests
    cors({
      origin: "http://localhost:5173",
      methods: "GET,POST,PUT,DELETE,OPTIONS",
      allowedHeaders: "Content-Type,Authorization",
    })
  );

  app.use(express.json());

  app.use("/api", routes);

  app.use((err, req, res) => {
    logger.error(err.stack);
    res.status(err.status || 500).send({ error: err.mesaage });
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = startServer;

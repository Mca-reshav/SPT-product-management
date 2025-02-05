const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  console.error(`Environment file ${envFile} not found!`);
  process.exit(1);
}

require("./database/mongo.conn");
const { success, error, logAll } = require("./services/response.service");
const routes = require("./routes/index.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  logAll(req.method, req.path)
  next()
})
app.use("/web", routes);

process.on("uncaughtException", async (err) => {
  error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  const errorMessage =
    reason instanceof Error ? reason.stack || reason.message : reason;
  error(`Unhandled Rejection: ${errorMessage}`);
  process.exit(1);
});

const port = process.env.PORT || 6001
app.listen(port, async () => {
  success(true, `[SERVER] ${process.env.NODE_ENV} :: PORT: ${port}`);
});

module.exports = app;

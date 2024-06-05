const {
  server: { port, corsConfig },
} = require("./config");

const express = require("express");
require("express-async-errors");
const app = express();

app.use(require("helmet")());
app.use(express.json());
app.use(require("cookie-parser")());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")(corsConfig));
app.use(require("./middlewares/requestLog"));

app.use("/api/v1/auth", require("./routes/auth.routes"));

app.use(require("./middlewares/errorHandler"));
app.use(require("./middlewares/catchAll"));

app.listen(port, (err) => {
  if (err) {
    console.error("Error starting server: ", err);
    return;
  }
  console.log(`http://localhost:${port}`);
});

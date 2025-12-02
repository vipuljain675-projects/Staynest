const path = require("path");
const express = require("express");
const storeRouter = require("./routes/storeRouter");
const { router: hostRouter } = require("./routes/hostRouter");
const errorsController = require("./controllers/errors");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(storeRouter);
app.use("/host", hostRouter);

app.use(errorsController.pageNotFound);

const PORT = 3600;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
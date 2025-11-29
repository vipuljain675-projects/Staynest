const path = require("path");
const express = require("express");

const userRouter = require("./routes/userRouter");
const { router: hostRouter } = require("./routes/hostRouter");

const app = express();

/* ✅ ENABLE EJS */
app.set("view engine", "ejs");
app.set("views", "views");

/* ✅ MIDDLEWARE */
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

/* ✅ ROUTES */
app.use(userRouter);
app.use("/host", hostRouter);

/* ✅ 404 HANDLER */
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = 3200;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

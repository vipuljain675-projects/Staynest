const path = require("path");
const express = require("express");
const storeRouter = require("./routes/storeRouter");
const { router: hostRouter } = require("./routes/hostRouter");
const errorsController = require("./controllers/errorsController");

// Import the MongoDB Connection Wrapper
const mongoConnect = require('./utils/databaseUtils').mongoConnect;

const app = express();

// Setup View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));

// Middleware to serve Static Files (CSS, Images)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(storeRouter);         // Handles /, /homes, /bookings
app.use("/host", hostRouter); // Handles /host/add-home, etc.

// 404 Handler
app.use(errorsController.pageNotFound);

const PORT = 3600;

// Start Server ONLY after Database Connection is ready
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
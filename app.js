const path = require("path");
const express = require("express");
const storeRouter = require("./routes/storeRouter");
const { router: hostRouter } = require("./routes/hostRouter");
const errorsController = require("./controllers/errorsController");

// --- 1. NEW: Import the database connection ---
const db = require('./utils/databaseUtils'); 

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(storeRouter);
app.use("/host", hostRouter);

app.use(errorsController.pageNotFound);

const PORT = 3600;

// --- 2. NEW: Test the Database Connection ---
db.execute('SELECT 1 + 1 AS result')
  .then(([rows, fields]) => {
    console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
    console.log('Test Query Result:', rows[0].result); // Should print 2
  })
  .catch(err => {
    console.log('❌ DATABASE CONNECTION FAILED');
    console.log(err);
  });
// ---------------------------------------------

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
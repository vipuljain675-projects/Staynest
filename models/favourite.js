const mongodb = require('mongodb');
const getDb = require("../utils/databaseUtils").getDb;

module.exports = class Favourite {
  static addToFavourites(homeId) {
    const db = getDb();
    return db.collection("favourites")
      .insertOne({ homeId: new mongodb.ObjectId(homeId) }) // Store as object
      .then(result => console.log("Added to Favourites"))
      .catch(err => console.log(err));
  }

  static getFavourites() {
    const db = getDb();
    return db.collection("favourites")
      .find()
      .toArray()
      .then(favourites => {
        return favourites;
      })
      .catch(err => console.log(err));
  }

  static deleteById(homeId) {
    const db = getDb();
    return db.collection("favourites")
      .deleteOne({ homeId: new mongodb.ObjectId(homeId) })
      .then(() => console.log("Removed from Favourites"))
      .catch(err => console.log(err));
  }
};
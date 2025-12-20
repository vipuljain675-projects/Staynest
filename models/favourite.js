const db = require("../utils/databaseUtils");

module.exports = class Favourite {
  
  static addToFavourites(homeId) {
    // INSERT IGNORE means: if it's already there, ignore the error (don't duplicate)
    return db.execute("INSERT IGNORE INTO favourites (homeId) VALUES (?)", [homeId]);
  }

  static getFavourites() {
    return db.execute("SELECT homeId FROM favourites");
  }

  static deleteById(homeId) {
    return db.execute("DELETE FROM favourites WHERE homeId = ?", [homeId]);
  }
};
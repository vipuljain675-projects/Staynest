const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

const favouriteDataPath = path.join(rootDir, "data", "favourite.json");

module.exports = class Favourite {
  
  static addToFavourites(homeId, callback) {
    Favourite.getFavourites((favourites) => {
      // Check if it already exists (prevent duplicates)
      if (!favourites.includes(homeId)) {
        favourites.push(homeId);
        fs.writeFile(favouriteDataPath, JSON.stringify(favourites), callback);
      } else {
        callback(); // Already there, do nothing but return
      }
    });
  }

  static getFavourites(callback) {
    fs.readFile(favouriteDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }

  static deleteById(delHomeId, callback) {
    Favourite.getFavourites((favourites) => {
      const updatedFavourites = favourites.filter((homeId) => homeId !== delHomeId);
      fs.writeFile(favouriteDataPath, JSON.stringify(updatedFavourites), callback);
    });
  }
};
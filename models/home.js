const db = require("../utils/databaseUtils");

module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl, description) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description = description;
  }

  save() {
    return db.execute(
      "INSERT INTO homes (houseName, price, location, rating, photoUrl, description) VALUES (?, ?, ?, ?, ?, ?)",
      [this.houseName, this.price, this.location, this.rating, this.photoUrl, this.description]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM homes");
  }

  static findById(homeId) {
    return db.execute("SELECT * FROM homes WHERE id = ?", [homeId]);
  }

  static updateById(homeId, updatedInfo) {
    return db.execute(
      "UPDATE homes SET houseName=?, price=?, location=?, rating=?, photoUrl=?, description=? WHERE id=?",
      [
        updatedInfo.houseName,
        updatedInfo.price,
        updatedInfo.location,
        updatedInfo.rating,
        updatedInfo.photoUrl,
        updatedInfo.description,
        homeId,
      ]
    );
  }

  static deleteById(homeId) {
    return db.execute("DELETE FROM homes WHERE id = ?", [homeId]);
  }

  static search(query) {
    const keyword = `%${query}%`;
    return db.execute(
      "SELECT * FROM homes WHERE houseName LIKE ? OR location LIKE ?", 
      [keyword, keyword]
    );
  }
};
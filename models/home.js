const mongodb = require('mongodb');
const getDb = require("../utils/databaseUtils").getDb;

class Home {
  constructor(houseName, price, location, rating, photoUrl, description, _id) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description = description;
    this._id = _id ? new mongodb.ObjectId(_id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection("homes").updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("homes").insertOne(this);
    }
    return dbOp.then(result => console.log(result)).catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("homes").find().toArray();
  }

  static findById(homeId) {
    const db = getDb();
    return db.collection("homes")
      .find({ _id: new mongodb.ObjectId(homeId) })
      .next();
  }

  // 👇 UPDATED SEARCH LOGIC
  static search(query) {
    const db = getDb();
    return db.collection("homes")
      .find({
        $or: [
          { houseName: { $regex: query, $options: "i" } }, // Search by Name
          { location: { $regex: query, $options: "i" } }   // Search by Location
        ]
      })
      .toArray();
  }

  static deleteById(homeId) {
    const db = getDb();
    return db.collection("homes")
      .deleteOne({ _id: new mongodb.ObjectId(homeId) });
  }
}

module.exports = Home;
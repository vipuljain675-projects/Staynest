const mongodb = require('mongodb');
const getDb = require("../utils/databaseUtils").getDb;

module.exports = class Booking {
  constructor(homeId, homeName, startDate, endDate, totalPrice, firstName, lastName, phone, email) {
    this.homeId = new mongodb.ObjectId(homeId); // Store link to home
    this.homeName = homeName; // We can duplicate this for easier access in NoSQL
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalPrice = totalPrice;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection("bookings")
      .insertOne(this)
      .then(result => console.log("✅ Booking Added"))
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    // We simple fetch all bookings
    return db.collection("bookings")
      .find()
      .toArray()
      .then(bookings => {
        return bookings;
      })
      .catch(err => console.log(err));
  }

  static deleteById(bookingId) {
    const db = getDb();
    return db.collection("bookings")
      .deleteOne({ _id: new mongodb.ObjectId(bookingId) })
      .then(() => console.log("Booking Deleted"))
      .catch(err => console.log(err));
  }
};
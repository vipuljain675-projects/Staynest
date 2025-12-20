const db = require("../utils/databaseUtils");

module.exports = class Booking {
  constructor(homeId, homeName, startDate, endDate, totalPrice, firstName, lastName, phone, email, guests) {
    this.homeId = homeId;
    this.homeName = homeName; // Note: We don't save homeName to DB, we join it in fetchAll
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalPrice = totalPrice;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
  }

  save() {
    return db.execute(
      "INSERT INTO bookings (homeId, firstName, lastName, email, startDate, endDate, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [this.homeId, this.firstName, this.lastName, this.email, this.startDate, this.endDate, this.totalPrice]
    );
  }

  static fetchAll() {
    // JOIN is the magic here. It gets the houseName from the homes table using homeId
    return db.execute(`
      SELECT bookings.*, homes.houseName 
      FROM bookings 
      JOIN homes ON bookings.homeId = homes.id
      ORDER BY bookings.startDate DESC
    `);
  }

  static deleteById(bookingId) {
    return db.execute("DELETE FROM bookings WHERE id = ?", [bookingId]);
  }
};
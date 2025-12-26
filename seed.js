const mongoose = require("mongoose");
const Home = require("./models/home");
const User = require("./models/user");

const MONGODB_URI = "mongodb://127.0.0.1:27017/airbnb";

// ---------------------------------------------------------
// 1. DATA GENERATORS
// ---------------------------------------------------------
const locations = [
  "Goa, India", "Manali, Himachal Pradesh", "Mumbai, Maharashtra", 
  "Kerala, India", "Udaipur, Rajasthan", "Bali, Indonesia", 
  "Paris, France", "Santorini, Greece", "Kyoto, Japan", 
  "New York, USA", "London, UK", "Dubai, UAE",
  "Maldives", "Swiss Alps, Switzerland", "Bangkok, Thailand"
];

const adjectives = [
  "Luxury", "Cozy", "Modern", "Rustic", "Seaside", "Mountain", 
  "Urban", "Vintage", "Charming", "Spacious", "Hidden", "Romantic"
];

const types = [
  "Villa", "Cottage", "Apartment", "Loft", "Bungalow", 
  "Cabin", "Penthouse", "Retreat", "Studio", "Mansion"
];

// High-quality Unsplash Image Collections
const images = [
  "https://images.unsplash.com/photo-1600596542815-e32c37e308f2?q=80&w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=800",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=800"
];

const interiors = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=800",
  "https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=800",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800"
];

// Helper to pick random item
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get random price
const getPrice = () => (Math.floor(Math.random() * 40) + 15) * 100; // 1500 to 5500

// Helper to get random rating
const getRating = () => (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);

// ---------------------------------------------------------
// 2. MAIN SCRIPT
// ---------------------------------------------------------
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("🔥 Connected to DB. Starting Seed...");

    // A. FIND OR CREATE SUPER HOST
    let hostUser = await User.findOne({ email: "host@test.com" });
    if (!hostUser) {
      hostUser = new User({
        firstName: "Super",
        lastName: "Host",
        email: "host@test.com",
        password: "123", // Simple password for testing
      });
      await hostUser.save();
      console.log("👤 Created Host User: host@test.com (Pass: 123)");
    } else {
      console.log("👤 Found Host User:", hostUser.email);
    }

    // B. CLEAR EXISTING HOMES (Optional - Comment out if you want to keep old data)
    // await Home.deleteMany({});
    // console.log("🧹 Cleared existing homes.");

    // C. GENERATE 30 HOMES
    const homes = [];
    for (let i = 0; i < 30; i++) {
      const loc = pick(locations);
      const adj = pick(adjectives);
      const type = pick(types);
      
      // Create a mix of images (1 Exterior + 2 Interiors)
      const homePhotos = [pick(images), pick(interiors), pick(interiors)];

      homes.push({
        houseName: `${adj} ${type} in ${loc.split(',')[0]}`,
        price: getPrice(),
        location: loc,
        rating: getRating(),
        photoUrl: homePhotos,
        description: `Experience the ultimate ${adj.toLowerCase()} living in this beautiful ${type.toLowerCase()}. Located in the heart of ${loc}, this home features modern amenities, breathtaking views, and a dedicated workspace. Perfect for families, couples, and solo travelers looking for a unique getaway.`,
        userId: hostUser._id
      });
    }

    // D. INSERT INTO DB
    await Home.insertMany(homes);
    console.log(`✅ Successfully added ${homes.length} homes!`);

    mongoose.disconnect();
    console.log("👋 Disconnected. Ready to test!");
  })
  .catch(err => {
    console.log("❌ Error:", err);
  });
const mongoose = require("mongoose");
require("dotenv").config(); // ✅ ADD THIS

const Home = require("./models/home");
const User = require("./models/user");

// ✅ USE ATLAS URI FROM .env
const MONGO_URL = process.env.MONGO_URI;

// 1. DATA SOURCES
const locations = [
  "Goa, India", "Manali, Himachal Pradesh", "Kerala, India",
  "Mumbai, Maharashtra", "Delhi, India", "Jaipur, Rajasthan",
  "Udaipur, Rajasthan", "Bangalore, Karnataka", "Pune, Maharashtra",
  "Chennai, Tamil Nadu", "Pondicherry, India", "Rishikesh, Uttarakhand",
  "Dubai, UAE", "London, UK", "Bali, Indonesia", "Paris, France",
  "New York, USA", "Tokyo, Japan", "Santorini, Greece", "Maldives"
];

const homeTypes = [
  "Villa", "Apartment", "Cottage", "Loft", "Bungalow",
  "Penthouse", "Studio", "Farmhouse", "Cabin", "Mansion"
];

const adjectives = [
  "Luxury", "Cozy", "Modern", "Seaside", "Hidden", "Vintage",
  "Charming", "Spacious", "Private", "Romantic", "Urban", "Rustic"
];

// 2. IMAGES
const imageUrls = [
  "https://images.unsplash.com/photo-1600596542815-2a4d04774c13?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=800&auto=format&fit=crop",
];

// Helpers
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const amenitiesList = ["Wifi", "AC", "Pool", "TV", "Kitchen", "Gym", "Parking", "Jacuzzi"];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("🔥 Connected to MongoDB Atlas");

    // 1. Get or create host
    let hostUser = await User.findOne({ userType: "host" });

    if (!hostUser) {
      console.log("👤 No host found. Creating one...");
      hostUser = new User({
        firstName: "Super",
        lastName: "Host",
        email: "host@airbnb.com",
        password: "hashedpassword123",
        userType: "host",
      });
      await hostUser.save();
    }

    console.log(`👤 Using host: ${hostUser.email}`);

    // 2. Clean homes
    await Home.deleteMany({});
    console.log("🧹 Cleared old homes");

    // 3. Create homes
    const homes = [];

    for (let i = 0; i < 100; i++) {
      const location = sample(locations);
      const adj = sample(adjectives);
      const type = sample(homeTypes);

      homes.push({
        houseName: `${adj} ${type} in ${location.split(",")[0]}`,
        price: Math.floor(Math.random() * 20000) + 1500,
        location,
        description: `Escape to this ${adj.toLowerCase()} ${type.toLowerCase()} located in ${location}.`,
        photoUrl: [imageUrls[i % imageUrls.length]],
        rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(2),
        amenities: amenitiesList.sort(() => 0.5 - Math.random()).slice(0, 4),
        userId: hostUser._id,
        availableFrom: new Date(),
        availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      });
    }

    await Home.insertMany(homes);
    console.log("✅ Seeded 100 homes successfully");

    await mongoose.connection.close();
    console.log("👋 DB connection closed");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
};

seedDB();

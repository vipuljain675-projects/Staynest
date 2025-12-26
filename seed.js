const mongoose = require("mongoose");
const Home = require("./models/home");
const User = require("./models/user");
const Booking = require("./models/booking");

const MONGODB_URI = "mongodb://127.0.0.1:27017/airbnb";

// ---------------------------------------------------------
// 1. DATA POOLS
// ---------------------------------------------------------
const cities = [
  "Goa, India", "Mumbai, Maharashtra", "Delhi, India", "Bangalore, Karnataka", 
  "Jaipur, Rajasthan", "Udaipur, Rajasthan", "Manali, Himachal", "Kerala, India",
  "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Pune, Maharashtra", "Hyderabad, Telangana",
  "New York, USA", "London, UK", "Paris, France", "Tokyo, Japan", "Dubai, UAE", 
  "Bali, Indonesia", "Bangkok, Thailand", "Santorini, Greece", "Maldives", 
  "Swiss Alps, Switzerland", "Rome, Italy", "Barcelona, Spain", "Sydney, Australia"
];

const adjectives = [
  "Luxury", "Cozy", "Modern", "Rustic", "Seaside", "Mountain", "Urban", "Vintage", 
  "Charming", "Spacious", "Hidden", "Romantic", "Exclusive", "Private", "Sunny"
];

const types = [
  "Villa", "Cottage", "Apartment", "Loft", "Bungalow", "Cabin", "Penthouse", 
  "Retreat", "Studio", "Mansion", "Resort", "Farmhouse"
];

const allAmenities = [
  "Wifi", "AC", "TV", "Pool", "Parking", "Kitchen", "Washer", "Gym", "Jacuzzi", "Fireplace"
];

const imagePool = [
  "https://images.unsplash.com/photo-1600596542815-e32c37e308f2?q=80&w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=800",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800"
];

// ---------------------------------------------------------
// 2. HELPER FUNCTIONS
// ---------------------------------------------------------
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomPrice = () => (Math.floor(Math.random() * 80) + 20) * 100;
const getRandomRating = () => (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);

const getRandomAmenities = () => {
  const shuffled = allAmenities.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 5) + 3);
};

const getRandomImages = () => {
  const shuffled = imagePool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
};

// 🟢 NEW: RANDOMIZED HOST WINDOW LOGIC
const getRandomHostWindow = () => {
  const today = new Date();
  
  // Start Date: Randomly between Today and 20 days from now
  const startOffset = Math.floor(Math.random() * 20); 
  const start = new Date(today);
  start.setDate(today.getDate() + startOffset);

  // End Date: Randomly between 1 month and 4 months after start
  // This ensures some homes close early, testing your logic!
  const duration = Math.floor(Math.random() * 90) + 30; 
  const end = new Date(start);
  end.setDate(start.getDate() + duration);

  return { start, end };
};

// ---------------------------------------------------------
// 3. MAIN SCRIPT
// ---------------------------------------------------------
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("🔥 Connected to DB. Clearing old data...");
    
    await Home.deleteMany({});
    await Booking.deleteMany({});
    
    // 1. Create Host User
    let hostUser = await User.findOne({ email: "host@test.com" });
    if (!hostUser) {
      hostUser = new User({
        firstName: "Super",
        lastName: "Host",
        email: "host@test.com",
        password: "123", 
        userType: "host"
      });
      await hostUser.save();
    }

    // 2. Create Guest User
    let guestUser = await User.findOne({ email: "guest@test.com" });
    if (!guestUser) {
      guestUser = new User({
        firstName: "Test",
        lastName: "Guest",
        email: "guest@test.com",
        password: "123", 
      });
      await guestUser.save();
    }

    console.log("🚀 Generating 500 Homes with VARIED seasons...");

    const homes = [];
    for (let i = 0; i < 500; i++) {
      const location = pick(cities);
      const adj = pick(adjectives);
      const type = pick(types);
      
      // 🟢 GET RANDOM DATES
      const { start, end } = getRandomHostWindow();

      homes.push({
        houseName: `${adj} ${type} in ${location.split(',')[0]}`,
        price: getRandomPrice(),
        location: location,
        rating: getRandomRating(),
        photoUrl: getRandomImages(),
        description: `Enjoy this beautiful ${type.toLowerCase()}. Features ${getRandomAmenities().slice(0,2).join(", ")}.`,
        amenities: getRandomAmenities(),
        
        // 🟢 SAVING RANDOM DATES
        availableFrom: start,
        availableTo: end,
        
        userId: hostUser._id
      });
    }

    const createdHomes = await Home.insertMany(homes);
    console.log(`✅ Created ${createdHomes.length} Homes.`);

    // 3. Generate Fake Bookings (Collisions)
    console.log("📅 Generating 200 Fake Bookings to block dates...");
    
    const bookings = [];
    const today = new Date();

    for (let i = 0; i < 200; i++) {
        const randomHome = pick(createdHomes);
        
        // Booking Start: Randomly in the next 30 days
        const startOffset = Math.floor(Math.random() * 30) + 1;
        const checkIn = new Date(today);
        checkIn.setDate(today.getDate() + startOffset);

        // Duration: 2-5 days
        const duration = Math.floor(Math.random() * 4) + 2;
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + duration);

        // Price Calc
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
        const totalPrice = nights * randomHome.price;

        bookings.push({
            homeId: randomHome._id,
            userId: guestUser._id,
            checkIn: checkIn,
            checkOut: checkOut,
            homeName: randomHome.houseName,
            totalPrice: totalPrice,
            price: randomHome.price
        });
    }

    await Booking.insertMany(bookings);
    console.log(`✅ Created ${bookings.length} Bookings.`);
    console.log("🎉 Database Seeded!");
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.log("❌ Error:", err);
  });
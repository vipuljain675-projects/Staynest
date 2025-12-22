const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(url)
    .then(client => {
      console.log('✅ Connected to MongoDB!');
      // This will create a database named 'airbnb' automatically
      _db = client.db('airbnb'); 
      callback();
    })
    .catch(err => {
      console.log('❌ Connection Failed:', err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
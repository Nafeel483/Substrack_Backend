const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const DB_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
   const dbObject = await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully...");
    return dbObject;
  } catch (err) {
    console.error(err.message);
    return undefined;
  }
};

module.exports = connectDB;


//  const dbObject = await mongoose.connect(DB_URI, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });
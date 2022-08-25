const mongoose = require("mongoose");
const url  = 'mongodb+srv://sai_9676_:sai_9676_@cluster0.ucdww.mongodb.net/userdb'

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Database Connection Success!');
    console.log(url)
  } catch (err) {
    console.log('MongoDB Database Connection Failed!', err.message);
  }
};

module.exports = connectDB;
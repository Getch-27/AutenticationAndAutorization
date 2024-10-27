const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

async function databaseConnect() {
  try {
    const dbuser = process.env.DB_USER;
    const password = encodeURIComponent(process.env.DB_PASSWORD);
    const dbName = process.env.DB_NAME;
    const connectionString = `mongodb+srv://${dbuser}:${password}@cluster0.kby06.mongodb.net/?retryWrites=true&w=majority&appName=${dbName}`;
                              
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to database ");
    
  } catch (error) {
    console.log(error);
  }
}
module.exports = databaseConnect;

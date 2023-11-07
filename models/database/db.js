const mongoose = require("mongoose");
//ACCESSING THE ENVIRONMENT VARIABLES
const dotenv = require("dotenv");
dotenv.config()

//CONNECTION TO DATABASE
module.exports = mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to db  ")
);
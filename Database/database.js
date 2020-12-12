

require("dotenv").config();
const mongoose = require('mongoose');
const url = process.env.DB_URL;

mongoose.connect(
    url
, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log(err.message);
})

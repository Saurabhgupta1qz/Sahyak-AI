import dotenv from "dotenv";
import mongoose from "mongoose";

mongoose
  .connect(
    `mongodb+srv://sanyamjain24a10025_db_user:Pe5zoFKXfOQ2BFdD@user-data.nyjfpzg.mongodb.net/user-data`
  )
  .then(function () {
    console.log("connected");
  })
  .catch(function (err: any) {
    console.log(err);
  });

module.exports = mongoose.connection;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default
    .connect(`mongodb+srv://sanyamjain24a10025_db_user:Pe5zoFKXfOQ2BFdD@user-data.nyjfpzg.mongodb.net/user-data`)
    .then(function () {
    console.log("connected");
})
    .catch(function (err) {
    console.log(err);
});
module.exports = mongoose_1.default.connection;

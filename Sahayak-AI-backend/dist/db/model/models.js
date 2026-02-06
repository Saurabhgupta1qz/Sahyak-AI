"use strict";
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
    },
    aadhar_number: {
        type: Number,
        length: 12,
    },
    address: String,
    photo_path: {
        type: String,
    },
});
const resultSchema = mongoose.Schema({
    Number: {
        type: String,
        trim: true,
    },
    Date_of_issue: {
        type: Date,
    },
    Class_of_Vehicles: String,
    Issued_by: String,
    Fee_paid: Number,
    Signature_path: String,
});
module.exports = mongoose.model("user", userSchema);
module.exports = mongoose.model("result", resultSchema);

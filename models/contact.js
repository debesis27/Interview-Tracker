const mongoose = require("mongoose");
const Schema = mongoose.Schema

const ContactSchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
    role: { type: String, required: true },
    email: { type: String }
})

module.exports = mongoose.model("Contact", ContactSchema)

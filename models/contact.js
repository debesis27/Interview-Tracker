const mongoose = require("mongoose");
const Schema = mongoose.Schema

const ContactSchema = new Schema({
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    name: { type: String, required: true, maxlength: 100 },
    role: { type: String, required: true },
    email: { type: String, maxlength: 100}
})

module.exports = mongoose.model("Contacts", ContactSchema, "interview_tracker")

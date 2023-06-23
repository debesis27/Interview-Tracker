const mongoose = require("mongoose");
const Schema = mongoose.Schema

const CompanySchema = new Schema({
    company: { type: String, required: true, maxlength: 100 },
    type: { type: String },
    role: { type: String, maxlength: 100 },
    location: { type: String },
    stage: { type: String }
})

module.exports = mongoose.model("Company", CompanySchema, "interview_tracker")

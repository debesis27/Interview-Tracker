const mongoose = require("mongoose");
const Schema = mongoose.Schema

const CompanySchema = new Schema({
    company: { type: String, required: true, maxlength: 100 },
    type: { type: String },
    role: { type: String, maxlength: 100 },
    location: { type: String },
    stage: { type: String },
    // contacts: { type: Schema.Types.ObjectId, ref: "Contact" },
    // tasks: { type: Schema.Types.ObjectId, ref: "Task" },
    // notes: { type: Schema.Types.ObjectId, ref: "Note" }
})

module.exports = mongoose.model("Company", CompanySchema, "interview_tracker")
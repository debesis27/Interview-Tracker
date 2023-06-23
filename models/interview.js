const mongoose = require("mongoose");
const Schema = mongoose.Schema

const InterviewSchema = new Schema({
    company: { type: Schema.Types.ObjectId, ref: "Company"},
    date: { type: Date, required: true},
    interview_location: { type: String, maxlength: 100},
    notes: { type: Schema.Types.ObjectId, ref: "Note"}
})

module.exports = mongoose.model("Interview", InterviewSchema, "interview_tracker")

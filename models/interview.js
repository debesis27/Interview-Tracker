const mongoose = require("mongoose");
const Schema = mongoose.Schema

const InterviewSchema = new Schema({
    date: { type: Date, required: true},
    interview_location: { type: String, maxlength: 100}
})

module.exports = mongoose.model("Interview", InterviewSchema)

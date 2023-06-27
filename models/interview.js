const mongoose = require("mongoose");
const Schema = mongoose.Schema

const InterviewSchema = new Schema({
    date: { type: Date },
    interview_location: { type: String }
})

module.exports = mongoose.model("Interview", InterviewSchema)

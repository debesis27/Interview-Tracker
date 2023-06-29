const mongoose = require("mongoose");
const Schema = mongoose.Schema

const InterviewSchema = new Schema({
    date: { type: Date },
    interview_location: { type: String }
});

//Virtual for interview's URL
InterviewSchema.virtual("url").get(function (){
    return "/tracker/interviews/" + this._id
});

module.exports = mongoose.model("Interview", InterviewSchema)

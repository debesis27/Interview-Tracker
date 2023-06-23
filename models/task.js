const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    task: { type: String, required: true },
    due_date: { type: Date, required: true }
})

module.exports = mongoose.model("Task", TaskSchema, "interview_tracker")

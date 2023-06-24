const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    task: { type: String, required: true },
    due_date: { type: Date, required: true }
})

module.exports = mongoose.model("Task", TaskSchema)

const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    task: { type: String, required: true },
    due_date: { type: Date }
});

//Virtual for task's URL
TaskSchema.virtual("url").get(function (){
    return "/tracker/tasks/" + this._id
});

module.exports = mongoose.model("Task", TaskSchema)

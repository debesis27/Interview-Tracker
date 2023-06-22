const mongoose = require("mongoose");
const Schema = mongoose.Schema

const NoteSchema = new Schema({
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    note: { type: String, required: true}
})

module.exports = mongoose.model("Note", NoteSchema, "interview_tracker")

const mongoose = require("mongoose");
const Schema = mongoose.Schema

const CompanySchema = new Schema({
    company_name: { type: String, required: true, maxlength: 100 },
    type: { type: String },
    role: { type: String, maxlength: 100 },
    stage: { type: String },
    contacts: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
    interview: { type: Schema.Types.ObjectId, ref: "Interview", default: null },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    notes: [{ type: String }]
});

module.exports = mongoose.model("Company", CompanySchema)

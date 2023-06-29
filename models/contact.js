const mongoose = require("mongoose");
const Schema = mongoose.Schema

const ContactSchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
    role: { type: String, required: true },
    email: { type: String }
});

//Virtual for contact's URL
ContactSchema.virtual("url").get(function (){
    return "/tracker/contacts/" + this._id
});

module.exports = mongoose.model("Contact", ContactSchema)

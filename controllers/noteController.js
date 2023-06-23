const { body, validation } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Note = require("../models/note");

//Get list of all notes
exports.notes_list = asyncHandler(async(req, res, next) => {
    const allNote = await Note.find()
        .populate("company")
        .exec();

    res.render("notes", { title: "Notes", notes_list: allNote });
});

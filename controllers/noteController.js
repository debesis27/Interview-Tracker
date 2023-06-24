const { body, validation } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");

//Get list of all notes
exports.notes_list = asyncHandler(async(req, res, next) => {
    const allCompanies = await Company.find()
        .sort({company_name: 1})
        .exec();

    res.render("notes", { title: "Notes", company_list: allCompanies });
});

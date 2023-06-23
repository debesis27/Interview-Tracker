const { body, validation } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");

//Get list of all contacts
exports.contact_list = asyncHandler(async(req, res, next) => {
    const allCompanies = await Company.find()
        .sort({company_name: 1})
        .populate("contacts")
        .exec();

    res.render("contacts", { title: "Contacts", company_list: allCompanies });
});

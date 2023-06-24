const { body, validation } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Task = require("../models/task");

//Get list of all companies
exports.company_list = asyncHandler(async(req, res, next) => {
    const allCompanies = await Company.find()
        .sort({company_name: 1})
        .populate("tasks")
        .exec();

    res.render("companies", { title: "Companies", company_list: allCompanies });
});

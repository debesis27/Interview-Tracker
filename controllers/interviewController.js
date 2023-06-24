const { body, validation } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Interview = require("../models/interview");

//Get all Interviews
exports.interview_list = asyncHandler(async(req, res, next) => {
    const allCompanies = await Company.find()
        .sort({company_name: 1})
        .populate("interview")
        .populate("tasks")
        .exec();

    res.render("interviews", { title: "Interviews", company_list: allCompanies });
});

const { body, validation } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");

//Get list of all tasks
exports.task_list = asyncHandler(async(req, res, next) => {
    const allCompanies = await Company.find()
        .sort({company_name: 1})
        .populate("tasks")
        .exec();

    res.render("tasks", { title: "Tasks", company_list: allCompanies });
});

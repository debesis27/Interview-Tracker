const { body, validation, validationResult } = require("express-validator");
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

//Display Interview Create Form on GET
exports.interview_create_get = asyncHandler(async(req, res, next) => {
    const allCompanies = await Company.find()
        .sort({company_name: 1})
        .exec();

    res.render("interview_form", {
        title: "Create Interview",
        interview: "",
        company_list: allCompanies,
        errors: []
    });
});

//Handle Interview Create on POST
exports.interview_create_post = [
    body("company_id")
        .isLength({ min: 1 })
        .escape()
        .withMessage("Company name must be specified."),
    body("stage")
        .isLength({ min: 1 })
        .escape()
        .withMessage("Interview stage must be specified."),
    body("date", "invalid date")
        .isISO8601()
        .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        const allCompanies = await Company.find()
            .sort({company_name: 1})
            .exec();

        const interview = new Interview({
            date: req.body.date,
            interview_location: req.body.interview_location,
        });

        if(!errors.isEmpty()){
            res.render("interview_form", {
                title: "Create Interview",
                interview: interview,
                company_list: allCompanies,
                errors: errors.array()
            });
            return;
        }else{
            await interview.save();
            await Company.findByIdAndUpdate(req.body.company_id, { interview: interview._id}, {});
            console.log(`Interview saved}`);
            res.redirect("/tracker/interviews");
        }
    })
]

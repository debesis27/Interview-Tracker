const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Task = require("../models/task");

//Get list of all companies
exports.company_list = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.populate("tasks")
		.exec();

	res.render("companies", { title: "Companies", company_list: allCompanies });
});

//Display Company create form on GET
exports.company_create_get = (req, res) => {
	res.render("company_form", {
		title: "Add Company",
		company: "",
		errors: []
	});
}

//Handle Company create on POST
exports.company_create_post = [
	body("company_name", "company name must be specified")
		.trim()
		.isLength({ min: 1 }),
	body("type", "type has non-alphanumeric characters")
		.trim()
		.isAlphanumeric(),
	body("role")
		.trim()
		.isLength({ max: 100 }),
	body("stage", "type has non-alphanumeric characters")
		.trim()
		.isAlphanumeric(),

	asyncHandler(async(req, res, next) => {
		const errors = validationResult(req);
		
		const company = new Company({
			company_name: req.body.company_name,
    	type: req.body.type,
    	role: req.body.role,
    	stage: req.body.stage,
    	contacts: [],
    	tasks: [],
    	notes: []
		});

		if(!errors.isEmpty()){
			res.render("company_form", {
				title: "Add Company",
				company: company,
				errors: errors.array(),
			});
			return;
		}else{
			await company.save();
			console.log(`Company ${company.company_name} saved`);
			res.redirect("/tracker/companies");
		}
	})
]

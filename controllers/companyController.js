const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Contact = require("../models/contact");
const Interview = require("../models/interview");
const Task = require("../models/task");

// Get list of all companies
exports.company_list = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.populate("tasks")
		.exec();

	res.render("companies", { title: "Companies", company_list: allCompanies });
});

// Display Company create form on GET
exports.company_create_get = (req, res) => {
	res.render("company_form", {
		title: "Add Company",
		company: "",
		errors: []
	});
};

// Handle Company create on POST
exports.company_create_post = [
	body("company_name", "company name must be specified")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("type", "type has non-alphanumeric characters")
		.trim()
		.isAlphanumeric()
		.escape(),
	body("role")
		.trim()
		.isLength({ max: 100 })
		.escape(),
	body("stage")
		.trim()
		.escape()
		.isLength({ max: 100 })
		.withMessage("stage has to be specified"),

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
			console.log(`New company: ${company.company_name}`);
			res.redirect("/tracker/companies");
		}
	})
];

// Display Company update form on GET
exports.company_update_get = asyncHandler(async(req, res, next) => {
	const company = await Company.findById(req.params.id).exec();

	if(company == null){
		const err = new Error("Company not found");
		err.status = 404;
		return next(err);
	};

	if(company.stage === "Researching") company.researching = true;
	else if(company.stage === "Applied") company.applied = true;
	else if(company.stage === "Phone Screen") company.phone_screen = true;
	else if(company.stage === "Onsite") company.onsite = true;
	else if(company.stage === "References") company.references = true;
	else if(company.stage === "Offer") company.offer = true;

	res.render("company_form", {
		title: "Update Company",
		company: company,
		errors: []
	});
});

// Handle Company update on POST
exports.company_update_post = [
	body("company_name", "company name must be specified")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("type", "type has non-alphanumeric characters")
		.trim()
		.isAlphanumeric()
		.escape(),
	body("role")
		.trim()
		.isLength({ max: 100 })
		.escape(),
	body("stage", "type has non-alphanumeric characters")
		.trim()
		.isAlphanumeric()
		.escape(),

	asyncHandler(async(req, res, next) => {
		const errors = validationResult(req);
		const oldCompany = await Company.findById(req.params.id).exec();

		const newCompany = new Company({
			company_name: req.body.company_name,
			type: req.body.type,
			role: req.body.role,
			stage: req.body.stage,
			contacts: oldCompany.contacts,
			tasks: oldCompany.tasks,
			notes: oldCompany.notes,
			_id: req.params.id
		});

		if(!errors.isEmpty()){
			res.render("company_form", {
				title: "Update Company",
				company: newCompany,
				errors: errors.array(),
			});
			return;
		}else{
			await Company.findByIdAndUpdate(req.params.id, newCompany, {});
			console.log(`Updated company: ${newCompany.company_name}`);
			res.redirect("/tracker/companies");
		}
	})
];

// Handle Company delete on GET
exports.company_delete_get = asyncHandler(async(req, res, next) => {
	const company = await Company.findById(req.params.id).exec();
	
	if(company == null){
		const err = new Error("Company not found");
		err.status = 404;
		return next(err);
	}

	for(let i = 0; i < company.contacts.length; i++){
		await Contact.findByIdAndDelete(company.contacts[i]);
	}
	for(let i = 0; i < company.tasks.length; i++){
		await Task.findByIdAndDelete(company.tasks[i]);
	}
	await Interview.findByIdAndDelete(company.interview);
	await Company.findByIdAndDelete(req.params.id);
	console.log(`Deleted company: ${company.company_name}`);
	res.redirect("/tracker/companies");
});

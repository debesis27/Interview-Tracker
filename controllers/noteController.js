const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");

//Get list of all notes
exports.notes_list = asyncHandler(async(req, res, next) => {
	const allCompanies = await Company.find()
		.sort({company_name: 1})
		.exec();

	res.render("notes", { title: "Notes", company_list: allCompanies });
});

//Display Note Create Form on GET
exports.note_create_get = asyncHandler(async(req, res, next) => {
	const allCompanies = await Company.find()
		.sort({company_name: 1})
		.exec();
	
	res.render("notes_form", {
		title: "Create Note",
		note: "",
		company_list: allCompanies,
		errors: []
	});
});

//Handle Note Create on POST
exports.note_create_post = [
	body("company_id")
		.isLength({ min: 1 })
		.escape()
		.withMessage("Company must be specified."),
	body("note")
		.isLength({ min: 1 })
		.withMessage("Note must be specified.")
		.escape(),

	asyncHandler(async(req, res, next) => {
		const errors = validationResult(req);

		const allCompanies = await Company.find()
			.sort({company_name: 1})
			.exec();

		if(!errors.isEmpty()){
			res.render("notes_form", {
				title: "Create Note",
				note: req.body.note,
				company_list: allCompanies,
				errors: errors.array()
			});
		}else{
			await Company.findByIdAndUpdate(req.body.company_id, { $push: { notes: req.body.note } }, {});
			console.log(`Note added: ${req.body.note}`);
			res.redirect("/tracker/notes");
		}
	})
]

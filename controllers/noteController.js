const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");

// Get list of all notes
exports.notes_list = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.exec();

	res.render("notes", { title: "Notes", company_list: allCompanies });
});

// Display Note Create Form on GET
exports.note_create_get = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.exec();

	res.render("note_form", {
		title: "Create Note",
		note: "",
		company_list: allCompanies,
		errors: []
	});
});

// Handle Note Create on POST
exports.note_create_post = [
	body("company_id")
		.isLength({ min: 1 })
		.escape()
		.withMessage("Company must be specified."),
	body("note")
		.isLength({ min: 1 })
		.withMessage("Note must be specified.")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const allCompanies = await Company.find()
			.sort({ company_name: 1 })
			.exec();

		if (!errors.isEmpty()) {
			res.render("note_form", {
				title: "Create Note",
				note: req.body.note,
				company_list: allCompanies,
				errors: errors.array()
			});
		} else {
			await Company.findByIdAndUpdate(req.body.company_id, { $push: { notes: req.body.note } }, {});
			console.log(`Note added: ${req.body.note}`);
			res.redirect("/tracker/notes");
		}
	})
]

// Display Note Update Form on GET
exports.note_update_get = asyncHandler(async(req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.exec();

		let note;
		for(let i = 0; i < allCompanies.length; i++){
			if(allCompanies[i]._id == req.params.id){
				allCompanies[i].selected = true;
				note = allCompanies[i].notes[req.params.index];
				break;
			}
		}

		res.render("note_form", {
			title: "Update Note",
			note: note,
			company_list: allCompanies,
			errors: []
		});
});

// Handle Note Update on POST
exports.note_update_post = [
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
			.sort({ company_name: 1 })
			.exec();

		for(let i = 0; i < allCompanies.length; i++){
			if(allCompanies[i]._id == req.body.company_id){
				allCompanies[i].selected = true;
				break;
			}
		}

		if (!errors.isEmpty()) {
			res.render("note_form", {
				title: "Update Note",
				note: req.body.note,
				company_list: allCompanies,
				errors: errors.array()
			});
		}else{
			await Company.findByIdAndUpdate(req.params.id, { $set: { [`notes.${req.params.index}`]: req.body.note } }, {});
			console.log(`Note updated: ${req.body.note}`);
			res.redirect("/tracker/notes");
		}
	})
];

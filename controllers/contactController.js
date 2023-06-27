const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Contact = require("../models/contact");

//Get list of all contacts
exports.contact_list = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.populate("contacts")
		.exec();

	res.render("contacts", { title: "Contacts", company_list: allCompanies });
});

//Display contact create form on GET
exports.contact_create_get = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.exec();

	res.render("contact_form", {
		title: "Add Contact",
		contact: "",
		company_list: allCompanies,
		errors: []
	});
});

//Handle contact create on POST
exports.contact_create_post = [
	body("company_id")
		.isLength({ min: 1 })
		.escape()
		.withMessage("Company name must be specified."),
	body("name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Contact name must be specified.")
		.isAlphanumeric()
		.withMessage("Contact name has non-alphanumeric characters.")
		.isLength({ max: 100 })
		.withMessage("Contact name must be 100 characters or less."),
	body("role")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Contact role must be specified."),
	body("email")
		.trim()
		.escape()
		.isEmail()
		.withMessage("Contact email must be specified."),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const allCompanies = await Company.find()
			.sort({ company_name: 1 })
			.exec();

		const contact = new Contact({
			name: req.body.name,
			role: req.body.role,
			email: req.body.email
		});

		if (!errors.isEmpty()) {
			res.render("contact_form", {
				title: "Add Contact",
				contact: contact,
				company_list: allCompanies,
				errors: errors.array()
			});
			return;
		} else {
			await contact.save();
			await Company.findByIdAndUpdate(req.body.company_id, { $push: { contacts: contact._id } }, {} );
			console.log(`New Contact: ${contact.name}`);
			res.redirect("/tracker/contacts");
		}
	})
];

const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Contact = require("../models/contact");

// Get list of all contacts
exports.contact_list = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.populate("contacts")
		.exec();

	res.render("contacts", { title: "Contacts", company_list: allCompanies });
});

// Display contact create form on GET
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

// Handle contact create on POST
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
			await Company.findByIdAndUpdate(req.body.company_id, { $push: { contacts: contact._id } }, {});
			console.log(`New Contact: ${contact.name}`);
			res.redirect("/tracker/contacts");
		}
	})
];

// Display contact update on GET
exports.contact_update_get = asyncHandler(async (req, res, next) => {
	const [contact, allCompanies] = await Promise.all([
		Contact.findById(req.params.id).exec(),
		Company.find()
			.sort({ company_name: 1 })
			.populate("contacts")
			.exec()
	]);

	if (contact == null) {
		const err = new Error("Contact not found");
		err.status = 404;
		return next(err);
	}

	let contactCompany = "";
	for (let i = 0; i < allCompanies.length; i++) {
		for (let j = 0; j < allCompanies[i].contacts.length; j++) {
			if (allCompanies[i].contacts[j]._id.toString() === contact._id.toString()) {
				contactCompany = allCompanies[i];
				break;
			}
		}
	}

	for (const company of allCompanies) {
		if (company._id.toString() === contactCompany._id.toString()) {
			company.selected = true;
		}
	}

	res.render("contact_form", {
		title: "Update Contact",
		contact: contact,
		company_list: allCompanies,
		errors: []
	});
});

// Handle contact update on POST
exports.contact_update_post = [
	body("company_id")
		.isLength({ min: 1 })
		.escape()
		.withMessage("Company name must be specified."),
	body("name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Contact name must be specified.")
		.isAlpha('en-US', { ignore: ' '})
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
			.populate("contacts")
			.exec();

		const newContact = new Contact({
			name: req.body.name,
			role: req.body.role,
			email: req.body.email,
			_id: req.params.id
		});

		if (!errors.isEmpty()) {
			let contactCompany = "";
			for (let i = 0; i < allCompanies.length; i++) {
				for (let j = 0; j < allCompanies[i].contacts.length; j++) {
					if (allCompanies[i].contacts[j]._id.toString() === newContact._id.toString()) {
						contactCompany = allCompanies[i];
						break;
					}
				}
			}

			for (const company of allCompanies) {
				if (company._id.toString() === contactCompany._id.toString()) {
					company.selected = true;
				}
			}

			res.render("contact_form", {
				title: "Update Contact",
				contact: newContact,
				company_list: allCompanies,
				errors: errors.array()
			});

			return;
		}else{
			let oldCompany;
      for (let i = 0; i < allCompanies.length; i++) {
        for (let j = 0; j < allCompanies[i].contacts.length; j++) {
          if (allCompanies[i].contacts[j]._id.toString() === newContact._id.toString()) {
            oldCompany = allCompanies[i];
						break;
          }
        }
      }

      await Contact.findByIdAndUpdate(req.params.id, newContact, {});

			if (oldCompany._id.toString() !== req.body.company_id.toString()){
				await Company.findByIdAndUpdate(oldCompany._id, { $pull: { contacts: task._id } });
				await Company.findByIdAndUpdate(req.body.company_id, { $push: { contacts: task._id } });
			}

			console.log(`Updated Contact: ${newContact.name}`);
			res.redirect("/tracker/contacts");
		}
	})
];

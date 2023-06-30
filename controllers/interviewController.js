const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Interview = require("../models/interview");

// Get all Interviews
exports.interview_list = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.populate("interview")
		.populate("tasks")
		.exec();

	res.render("interviews", { title: "Interviews", company_list: allCompanies });
});

// Display Interview Create Form on GET
exports.interview_create_get = asyncHandler(async (req, res, next) => {
	const allCompanies = await Company.find()
		.sort({ company_name: 1 })
		.exec();

	res.render("interview_form", {
		title: "Create Interview",
		interview: "",
		interview_date: "",
		company_list: allCompanies,
		errors: []
	});
});

// Handle Interview Create on POST
exports.interview_create_post = [
	body("company_id")
		.isLength({ min: 1 })
		.escape()
		.withMessage("Company name must be specified."),
	body("date", "invalid date")
		.isISO8601()
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const allCompanies = await Company.find()
			.sort({ company_name: 1 })
			.exec();

		const interview = new Interview({
			date: req.body.date,
			interview_location: req.body.interview_location,
		});

		for (let i = 0; i < allCompanies.length; i++) {
			if (allCompanies[i]._id.toString() === req.body.company_id.toString()) {
				allCompanies[i].selected = true;
				break;
			}
		}

		let interview_date;
		if(interview.date != null) interview_date = interview.date.toISOString().slice(0, 10);

		if (!errors.isEmpty()) {
			res.render("interview_form", {
				title: "Create Interview",
				interview: interview,
				interview_date: interview_date,
				company_list: allCompanies,
				errors: errors.array()
			});
			return;
		} else {
			await interview.save();
			await Company.findByIdAndUpdate(req.body.company_id, { interview: interview._id }, {});
			console.log(`Interview saved}`);
			res.redirect("/tracker/interviews");
		}
	})
];

// Display Interview Update Form on GET
exports.interview_update_get = asyncHandler(async (req, res, next) => {
	const [allCompanies, interview] = await Promise.all([
		Company.find()
			.sort({ company_name: 1 })
			.populate("interview")
			.exec(),
		Interview.findById(req.params.id).exec()
	]);

	if(interview == null){
		const err = new Error("Interview not found");
		err.status = 404;
		return next(err);
	}

	for (let i = 0; i < allCompanies.length; i++) {
		if (allCompanies[i].interview && allCompanies[i].interview._id && allCompanies[i].interview._id.toString() === interview._id.toString()) {
			allCompanies[i].selected = true;
			break;
		}
	}

	const interview_date = interview.date.toISOString().slice(0, 10);

	res.render("interview_form", {
		title: "Update Interview",
		interview: interview,
		interview_date: interview_date,
		company_list: allCompanies,
		errors: []
	});
});

// Handle Interview Update on POST
exports.interview_update_post = [
	body("company_id")
		.isLength({ min: 1 })
		.escape()
		.withMessage("Company name must be specified."),
	body("date", "invalid date")
		.isISO8601()
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const newInterview = new Interview({
			date: req.body.date,
			interview_location: req.body.interview_location,
			_id: req.params.id
		});

		if (!errors.isEmpty()) {
			const allCompanies = await Company.find().sort({ company_name: 1 }).exec();

			for (let i = 0; i < allCompanies.length; i++) {
				if (allCompanies[i].interview && allCompanies[i].interview._id && allCompanies[i].interview._id.toString() === newInterview._id.toString()) {
					allCompanies[i].selected = true;
					break;
				}
			};

			const interview_date = newInterview.date.toISOString().slice(0, 10);

			res.render("interview_form", {
				title: "Update Interview",
				interview: newInterview,
				interview_date: interview_date,
				company_list: allCompanies,
				errors: errors.array()
			});
		} else {
			let oldCompany;
      for (let i = 0; i < allCompanies.length; i++) {
        if (allCompanies[i].interview._id.toString() === newInterview._id.toString()) {
          oldCompany = allCompanies[i];
					break;
        }
      }

      await Interview.findByIdAndUpdate(req.params.id, newInterview, {});

			if (oldCompany._id.toString() !== req.body.company_id.toString()){
				await Company.findByIdAndUpdate(oldCompany._id, { interview: null } );
				await Company.findByIdAndUpdate(req.body.company_id, { interview: newInterview._id } );
			} 

			console.log(`Interview updated`);
			res.redirect("/tracker/interviews");
		}
	})
];

// Handle Interview Delete on GET
exports.interview_delete_get = asyncHandler(async (req, res, next) => {
	const [interview, allCompanies] = await Promise.all([
		Interview.findById(req.params.id),
		Company.find().sort({ company_name: 1 }).exec()
	]);

	if(interview == null){
		const err = new Error("Interview not found");
		err.status = 404;
		return next(err);
	}

	const interviewCompany = allCompanies.find(company => {
		return company.interview._id.toString() === interview._id.toString();
	})

	await Promise.all([
		Interview.findByIdAndRemove(req.params.id),
		Company.findByIdAndUpdate(interviewCompany._id, { interview: null })
	]);
	console.log(`Interview deleted`);
	res.redirect("/tracker/interviews");
});

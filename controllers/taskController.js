const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Task = require("../models/task");

// Get list of all tasks
exports.task_list = asyncHandler(async (req, res, next) => {
  const allCompanies = await Company.find()
    .sort({ company_name: 1 })
    .populate("tasks")
    .exec();

  res.render("tasks", { title: "Tasks", company_list: allCompanies });
});

// Display Task Create Form on GET
exports.task_create_get = asyncHandler(async (req, res, next) => {
  const allCompanies = await Company.find()
    .sort({ company_name: 1 })
    .exec();

  res.render("task_form", {
    title: "Create Task",
    task: "",
    task_due_date: "",
    company_list: allCompanies,
    errors: []
  });
})

// Handle Task Create on POST
exports.task_create_post = [
  body("company_id")
    .isLength({ min: 1 })
    .escape()
    .withMessage("Company name must be specified."),
  body("task")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Task must be specified."),
  body("due_date", "Invalid due date")
    .isISO8601(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const allCompanies = await Company.find()
      .sort({ company_name: 1 })
      .exec();

    const task = new Task({
      task: req.body.task,
      due_date: req.body.due_date,
    });

    const task_due_date = task.due_date.toISOString().slice(0, 10);

    if (!errors.isEmpty()) {
      res.render("task_form", {
        title: "Create Task",
        task: task,
        task_due_date: task_due_date,
        company_list: allCompanies,
        errors: errors.array()
      });
      return;
    } else {
      await task.save();
      await Company.findByIdAndUpdate(req.body.company_id, { $push: { tasks: task._id } });
      console.log(`Task Created: ${task.task}`);
      res.redirect("/tracker/tasks");
    }
  })
];

// Display Task Update Form on GET
exports.task_update_get = asyncHandler(async (req, res, next) => {
  const [task, allCompanies] = await Promise.all([
    Task.findById(req.params.id),
    Company.find().sort({ company_name: 1 }).exec()
  ]);

  for (let i = 0; i < allCompanies.length; i++) {
    for (let j = 0; j < allCompanies[i].tasks.length; j++) {
      if (allCompanies[i].tasks[j]._id.toString() === task._id.toString()) {
        allCompanies[i].selected = true;
      }
    }
  }

  const task_due_date = task.due_date.toISOString().slice(0, 10);

  res.render("task_form", {
    title: "Update Task",
    task: task,
    task_due_date: task_due_date,
    company_list: allCompanies,
    errors: [],
  });
});

// Handle Task Update on POST
exports.task_update_post = [
  body("company_id")
    .isLength({ min: 1 })
    .escape()
    .withMessage("Company name must be specified."),
  body("task")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Task must be specified."),
  body("due_date")
    .isISO8601()
    .escape()
    .withMessage("Invalid due date"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const [task, allCompanies] = await Promise.all([
      Task.findById(req.params.id),
      Company.find().sort({ company_name: 1 }).exec()
    ]);

    if (task == null) {
      const err = new Error("Task not found");
      err.status = 404;
      return next(err);
    }

    const newTask = new Task({
      task: req.body.task,
      due_date: req.body.due_date,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      for (let i = 0; i < allCompanies.length; i++) {
        for (let j = 0; j < allCompanies[i].tasks.length; j++) {
          if (allCompanies[i].tasks[j]._id.toString() === newTask._id.toString()) {
            allCompanies[i].selected = true;
          }
        }
      }
      
      const task_due_date = newTask.due_date.toISOString().slice(0, 10);

      res.render("task_form", {
        title: "Update Task",
        task: newTask,
        task_due_date: task_due_date,
        company_list: allCompanies,
        errors: errors.array()
      });
      return;
    }else{
      let oldCompany;
      for (let i = 0; i < allCompanies.length; i++) {
        for (let j = 0; j < allCompanies[i].tasks.length; j++) {
          if (allCompanies[i].tasks[j]._id.toString() === newTask._id.toString()) {
            oldCompany = allCompanies[i];
						break;
          }
        }
      }

      await Task.findByIdAndUpdate(req.params.id, updatedTask, {});

			if (oldCompany._id.toString() !== req.body.company_id.toString()){
				await Company.findByIdAndUpdate(oldCompany._id, { $pull: { tasks: newTask._id } });
				await Company.findByIdAndUpdate(req.body.company_id, { $push: { tasks: newTask._id } });
			} 

      console.log(`Task Updated: ${newTask.task}`);
      res.redirect("/tracker/tasks");
    }
  })

];

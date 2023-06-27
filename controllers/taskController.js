const { body, validation, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Company = require("../models/company");
const Task = require("../models/task");

//Get list of all tasks
exports.task_list = asyncHandler(async(req, res, next) => {
    const allCompanies = await Company.find()
        .sort({company_name: 1})
        .populate("tasks")
        .exec();

    res.render("tasks", { title: "Tasks", company_list: allCompanies });
});

//Display Task Create Form on GET
exports.task_create_get = asyncHandler(async(req, res, next) => {
    const allCompanies = await Company.find()
        .sort({company_name: 1})
        .exec();

    res.render("task_form", {
        title: "Create Task",
        task: "",
        company_list: allCompanies,
        errors: []
    });
})

//Handle Task Create on POST
exports.task_create_post = [
    body("task")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Task must be specified."),
    body("due_date", "Invalid due date")
        .isISO8601(),
    
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        const allCompanies = await Company.find()
            .sort({company_name: 1})
            .exec();

        const task = new Task({
            task: req.body.task,
            due_date: req.body.due_date,
        });

        if(!errors.isEmpty()){
            res.render("task_form", {
                title: "Create Task",
                task: task,
                company_list: allCompanies,
                errors: errors.array()
            });
            return;
        }else{
            await task.save();
            await Company.findByIdAndUpdate(req.body.company_id, { $push: { tasks: task._id } });
            console.log(`Task Created: ${task.task}`);
            res.redirect("/tracker/tasks");
        }
    })
]
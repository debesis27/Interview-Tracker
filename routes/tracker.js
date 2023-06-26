var express = require('express');
var router = express.Router();

// Required Controllers
const company_controller = require("../controllers/companyController");
const contact_controller = require("../controllers/contactController");
const interview_controller = require("../controllers/interviewController");
const note_controller = require("../controllers/noteController");
const task_controller = require("../controllers/taskController");

// GET users listing
router.get('/', function(req, res, next) {
  res.redirect("/tracker/companies");
});

// GET companies list
router.get('/companies', company_controller.company_list);

// GET request for creating a company
router.get('/companies/create', company_controller.company_create_get);

//POSt request for creating a company
router.post('/companies/create', company_controller.company_create_post);

router.get('/contacts', contact_controller.contact_list);

router.get('/interviews', interview_controller.interview_list);

router.get('/tasks', task_controller.task_list);

router.get('/notes', note_controller.notes_list);

module.exports = router;

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

/// COMPANY ROUTES ///

// GET companies list
router.get('/companies', company_controller.company_list);

// GET request for creating a company
router.get('/companies/create', company_controller.company_create_get);

// POSt request for creating a company
router.post('/companies/create', company_controller.company_create_post);

// GET request for updating a company
router.get('/companies/:id/update', company_controller.company_update_get);

// POST request for updating a company
router.post('/companies/:id/update', company_controller.company_update_post);

// GET request for deleting a company
router.get('/companies/:id/delete', company_controller.company_delete_get);

/// CONTACT ROUTES ///

// GET contacts list
router.get('/contacts', contact_controller.contact_list);

// GET request for creating a contact
router.get('/contacts/create', contact_controller.contact_create_get);

// POST request for creating a contact
router.post('/contacts/create', contact_controller.contact_create_post);

// GET request for updating a contact
router.get('/contacts/:id/update', contact_controller.contact_update_get);

// POST request for updating a contact
router.post('/contacts/:id/update', contact_controller.contact_update_post);

// GET request for deleting a contact
router.get('/contacts/:id/delete', contact_controller.contact_delete_get);

/// INTERVIEW ROUTES ///

// GET interviews list
router.get('/interviews', interview_controller.interview_list);

// GET request for creating an interview
router.get('/interviews/create', interview_controller.interview_create_get);

// POST request for creating an interview
router.post('/interviews/create', interview_controller.interview_create_post);

// GET request for updating an interview
router.get('/interviews/:id/update', interview_controller.interview_update_get);

// POST request for updating an interview
router.post('/interviews/:id/update', interview_controller.interview_update_post);

// GET request for deleting an interview
router.get('/interviews/:id/delete', interview_controller.interview_delete_get);

/// TASK ROUTES ///

// GET tasks list
router.get('/tasks', task_controller.task_list);

// GET request for creating a task
router.get('/tasks/create', task_controller.task_create_get);

// POST request for creating a task
router.post('/tasks/create', task_controller.task_create_post);

// GET request for updating a task
router.get('/tasks/:id/update', task_controller.task_update_get);

// POST request for updating a task
router.post('/tasks/:id/update', task_controller.task_update_post);

// GET request for deleting a task
router.get('/tasks/:id/delete', task_controller.task_delete_get);

/// NOTE ROUTES ///

// GET notes list
router.get('/notes', note_controller.notes_list);

// GET request for creating a note
router.get('/notes/create', note_controller.note_create_get);

// POST request for creating a note
router.post('/notes/create', note_controller.note_create_post);

// GET request for updating a note
router.get('/notes/:id/:index/update', note_controller.note_update_get);

// POST request for updating a note
router.post('/notes/:id/:index/update', note_controller.note_update_post);

// GET request for deleting a note
router.get('/notes/:id/:index/delete', note_controller.note_delete_get);

module.exports = router;

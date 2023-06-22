var express = require('express');
var router = express.Router();

// GET users listing
router.get('/', function(req, res, next) {
  res.redirect("/tracker/companies");
});

router.get('/companies', function(req, res, next){
  res.render("companies", { title: "Companies" })
})

router.get('/contacts', function(req, res, next){
  res.render("contacts", { title: "Contacts" })
})

router.get('/interviews', function(req, res, next){
  res.render("interviews", { title: "Interviews" })
})

router.get('/tasks', function(req, res, next){
  res.render("tasks", { title: "Tasks" })
})

router.get('/notes', function(req, res, next){
  res.render("notes", { title: "Notes" })
})

module.exports = router;

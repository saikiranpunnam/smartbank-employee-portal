const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");

router.get("/employees", controller.getEmployees);
router.post("/employees", controller.addEmployee);

module.exports = router;

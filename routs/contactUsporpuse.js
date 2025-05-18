const express = require("express");
const router = express.Router();

const { checkAuthentication, student } = require("../middleware/authorize");
//import contact us handler function
const { contactUshandler } = require("../controllers/contactus");
//mape controller with route
router.post("/sendfeedback", checkAuthentication, contactUshandler);

module.exports = router;

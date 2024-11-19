const express = require("express")
const router = express.Router();

//import capturepayment & verifySignature

const {capturePayment,verifySignature} = require("../controllers/payment");

const {checkAuthentication,student,admin } = require("../middleware/authorize");

//map handler function with route
router.post("/capturepayment",checkAuthentication,student, capturePayment );
router.post("/verifysignature", verifySignature);

//exports route
module.exports = router;
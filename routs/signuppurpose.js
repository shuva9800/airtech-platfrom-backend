const express = require("express")
const router = express.Router();

//import signup,otpcreation, login,update password, token middle ware
const {otpCreation, signUp, login, passwordChange} = require("../controllers/auth");

//middleware fof verification
const {checkAuthentication} = require("../middleware/authorize")

//maping path with handler function
router.post("/signup", signUp);
router.post("/sendotp", otpCreation);
router.post("/login", login);
router.put("/updatepassword",checkAuthentication,passwordChange );


//reset password middle ware

const {resetPasswordToken,resetPassword} = require("../controllers/resetpassword");

//maping path with handler function
router.post("/reset-password-token",resetPasswordToken);
router.post("/resetpassword",resetPassword);

//exports route
module.exports = router;
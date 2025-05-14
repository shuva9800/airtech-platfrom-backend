const OTP = require("../models/otp");
const User = require("../models/user");
const Profile = require("../models/profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//not same with codehelp code in signup

// addition code in signup

//send otp
exports.otpCreation = async (req, res) => {
  try {
    const { email } = req.body;
    const validUser = await User.findOne({ email });

    if (validUser) {
      return res.status(404).json({
        success: false,
        message: " User is already registered",
      });
    }
    // otp generate
    var newOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    //for unique otp creation
    let findOtp = await OTP.findOne({ otp: newOtp });

    while (findOtp) {
      newOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      findOtp = await OTP.findOne({ otp: newOtp });
    }

    //otp save in DB
    const saveOtp = await OTP.create({ email, otp: newOtp });
    return res.status(200).json({
      success: true,
      message: "otp generate successfully",
      newOtp,
    });
  } catch (error) {
    console.log("error in otpCreation section");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    //validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "please fill all the details",
      });
    }
    //two password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password & confirmpasswor doesnot match please try again",
      });
    }
    //check user alraedy exist or not?
    const validUser = await User.findOne({ email });
    if (validUser) {
      return res.status(400).json({
        success: false,
        message: " user is already registered",
      });
    }
    //find most recent otp store in db for user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    //   .sort({ createdAt: -1 }):

    //   This sorts the matching documents by the createdAt field in descending order (-1 means descending).
    //   It ensures the most recent record, based on the creation time, comes first.

    //   .limit(1):

    //   Limits the result to only one document. This ensures only the most recent OTP record is retrieved.

    //validation for otp
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "otp invalid",
      });
    }
    //has password
    const hassPassword = await bcrypt.hash(password, 10);

    //check if password is hashed or not
    if (!hassPassword) {
      return res.status(400).json({
        success: false,
        message: " password not hashed",
      });
    }
    //additional details

    const additionalDetails = await Profile.create({
      gender: "Male",
      dateOfbirth: null,
      aboutre: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hassPassword,
      confirmpassword: hassPassword,
      accountType,
      additionalInfo: additionalDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "entry created in databaase for new user",
      data: user,
    });
  } catch (error) {
    console.log("error in creating db entry for new user");
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
      message: "error creating db entry for new user",
    });
  }
};

//Login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "fill all the requirement",
      });
    }
    const findPerson = await User.findOne({ email }).populate("additionalInfo");
    if (!findPerson) {
      return res.status(404).json({
        success: false,
        message: "user is not register, Please Sigup first ",
      });
    }
    if (bcrypt.compareSync(password, findPerson.password)) {
      const payload = {
        email: findPerson.email,
        id: findPerson._id,
        accountType: findPerson.accountType,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "5hr",
      });
      //  findPerson = findPerson.toObject();
      findPerson.token = token;
      findPerson.password = undefined;

      //coocki creation
      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("shuvaCookie", token, option).status(200).json({
        success: true,
        message: "login successfully",
        data: findPerson,
        token: token,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: " password does't match try again",
      });
    }
  } catch (error) {
    console.log("error in login section");
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
      message: "login fail please try again",
    });
  }
};

//password change

exports.passwordChange = async (req, res) => {
  try {
    //is there email is needed
    const { oldPassword, newPassword, confirmnewPassword } = req.body;

    const userId = req.findPerson.id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user id not matching",
      });
    }
    const user = await User.findById(userId);
    if (await bcrypt.compare(oldPassword, user.password)) {
      if (newPassword !== confirmnewPassword) {
        return res.status(400).json({
          success: false,
          message: "newpassword and confirmnewPassword does not match",
        });
      }
      const passwordUpdate = await bcrypt.hash(newPassword, 10);
      const updatedPassword = await User.findByIdAndUpdate(
        { _id: userId },
        { password: passwordUpdate },
        { new: true }
      );
      const mailSend = require("../utility/mailSender");
      const responseOfMailsend = await mailSend(
        user.email,
        "passwordchange-complete",
        "password update successfully"
      );
      return res.status(200).json({
        success: true,
        message: "'password update successfully",
        updatedPassword,
        responseOfMailsend,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "enter password does  not match for the user",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "password update failed try again",
    });
  }
};

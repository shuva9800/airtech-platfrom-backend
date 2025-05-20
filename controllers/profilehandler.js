const Profile = require("../models/profile");
const User = require("../models/user");
const Course = require("../models/courses");
const { imageUploadToCloudinary } = require("../utility/imageUpload");
require("dotenv").config();

exports.updateProfile = async (req, res) => {
  try {
    const { gender, dateOfbirth = "", aboute = "", contactNumber } = req.body;
    const userId = req.findPerson.id;

    //validation
    if (!userId || !gender || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "fill the require fields",
      });
    }
    //find user using userId
    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalInfo;
    const profileDetails = await Profile.findById(profileId);
    //add additional details with profile details
    profileDetails.gender = gender;
    profileDetails.dateOfbirth = dateOfbirth;
    profileDetails.aboute = aboute;
    profileDetails.contactNumber = contactNumber;
    //update profile in db
    await profileDetails.save();

    //response return
    return res.status(200).json({
      success: true,
      message: "additional details updated successfully",
      profileDetails,
      // updateProfile
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error occure while additional; details addding to profile",
    });
  }
};

//delete account
//how to schedule delete account operation ??crone job
//action needed in delete course section delet user????????

exports.deleteAccount = async (req, res) => {
  try {
    //get id of user
    const userId = req.findPerson.id;

    //validation
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user id does not exist",
      });
    }

    //delete user profile
    const userprofile = User.additionalInfo;
    await Profile.findByIdAndDelete(userprofile);
    //delete user from all enroll course?
    await Course.updateMany(
      { studentEnroll: userId },
      { $pull: { studentEnroll: userId } }
    );
    //.1
    //  const allCourse = await Course.find();
    //  const enrollUser = allCourse.studentEnroll;
    //  await enrollUser.findByIdAndDelete({_id:userId});
    //.5
    // action required 1-5

    // delete user
    const deleteUser = await User.findByIdAndDelete({ _id: userId });

    return res.status(200).json({
      success: true,
      message: " user and profile delete successfully",
      deleteUser,
    });
  } catch (error) {
    console.log("error in deleting profile ", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: " user cannot be deleted",
    });
  }
};

//'get user all details
exports.getAllDetails = async (req, res) => {
  try {
    //get id
    const id = req.findPerson.id;
    //find user details
    const userDetails = await User.findById(id)
      .populate("additionalInfo")
      .exec();
    //return res
    return res.status(200).json({
      success: true,
      message: "user details is here:-",
      userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: " somthing went to wrong while fatching user details",
    });
  }
};

//change profile picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const profilePicture = req.files.picture;
    const currentUser = req.findPerson.id;
   
    // Upload the Thumbnail to Cloudinary
    const profileImage = await imageUploadToCloudinary(
      profilePicture,
      process.env.FOLDER_NAME,
    );
    console.log(profileImage)
    const updatedUser = await User.findByIdAndUpdate(
      { _id: currentUser },
      { image: profileImage.secure_url },
      { new: true }
    );

    //return responce
    return res.status(200).json({
      success: true,
      message: "profile picture updated successfully",
      data:updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      eror:error.message,
      message: " somthing went to wrong while updating profile picture",
    });
  }
};
//Enroll course 
exports.getEnrolledCourses = async(req,res)=>{
    try{
const userId=req.findPerson.id;
 const userDetails =await User.findOne({_id:userId})
 .populate("courses")
 .exec()

 if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })

    }catch(error){
         return res.status(500).json({
      success: false,
      error:error.message,
      message: " somthing went to wrong while fetching enroll course",
    });
    }
}

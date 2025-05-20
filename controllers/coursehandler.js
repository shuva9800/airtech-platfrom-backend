const coures = require("../models/courses");
const Category = require("../models/catagory");
const User = require("../models/user");
const { imageUploadToCloudinary } = require("../utility/imageUpload");
require("dotenv").config();

//crating new course
exports.courseCreate = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.findPerson.id;

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
    } = req.body;

    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage;

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId);
    console.log("instractor dsetails-", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById({ _id: category });
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await imageUploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    console.log(thumbnailImage);
    // Create a new course with the given details
    const newCourse = await coures.create({
      courseName,
      courseDescription,
      instractor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tag,
      category: categoryDetails._id,
      thumbnil: thumbnailImage.secure_url,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//get all coures

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await coures.find({}).populate("courseContent");

    if (!allCourses) {
      return res.status(404).json({
        success: false,
        message: "there is no coures available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Here is the lists of all courses",
      allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error occure white all course data fetching",
    });
  }
};

//find specific courses with entire details  by given courseid
exports.getSpecificCourse = async (req, res) => {
  try {
    //fetch datamean course id
    const { courseid } = req.body;
    //validation
    if (!courseid) {
      return res.status(400).json({
        success: false,
        message: "course is not found",
      });
    }
    const courseDetails = await coures
      .findById({ _id: courseid })
      .populate({
        path: "instractor",
        populate: {
          path: "additionalInfo",
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .populate("ratingandreview")
      .populate({
        path: "studentEnroll",
        populate: {
          path: "additionalInfo",
        },
      })
      .populate("catagory")
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `course is not found which course id is:- ${courseid}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "course fetch successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error occure white  course data fetching by course id",
    });
  }
};

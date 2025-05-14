const Section = require("../models/section");
const Course = require("../models/courses");
// const section = require("../models/section");

exports.sectionCreate = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "section name is required",
      });
    }

    //create section in DB
    const newSection = await Section.create({ sectionName });

    //update section to course model
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          //?? needed or not?
          path: "subsection",
        },
      })
      .exec();
    // return responce
    return res.status(200).json({
      success: true,
      message: "New course is updated successfully to the course section",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log("error in createSectin", error);
    return res.status(500).json({
      success: false,
      message: "error while creating section creation",
      error: error.message,
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, sectionId } = req.body;
    //validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: " all fild are required",
      });
    }
    //updating section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { sectionName: sectionName },
      { new: true }
    );

    //responce return
    return res.status(200).json({
      success: true,
      message: " section updated successfully",
      updatedSection,
    });
  } catch (error) {
    console.log("error in updateSection", error);
    return res.status(500).json({
      success: false,
      message: "error while Updating section ",
      error: error.message,
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    //fetch section id
    //   const {sectionId} = req.params;
    const { sectionId, courseId } = req.body;
    //find by id and delete the course
    await Section.findByIdAndDelete(sectionId);

    // we need to update course schema as well
    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $pull: {
          courseContent: sectionId,
        },
      },
      { new: true }
    );

    //responce return
    return res.status(200).json({
      success: true,
      message: " section delete successfully",
    });
  } catch (error) {
    console.log("error in delete section", error);
    return res.status(500).json({
      success: false,
      message: "error while deleting section",
      error: error.message,
    });
  }
};

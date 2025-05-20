const Catagory = require("../models/catagory");

//only Admin can create Catagory/Tags
exports.catagoryCreation = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res.status(404).json({
        success: false,
        message: "all fill to be field",
      });
    }
    //create entry in DB
    const catagoryEntryinDb = await Catagory.create({
      name,
      description,
    });
    return res.status(200).json({
      success: true,
      message: " Catagory creation is successful",
      data: catagoryEntryinDb,
    });
  } catch (error) {
    console.log("error in catagory creation ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//fetch all tags

exports.showAllCatagory = async (req, res) => {
  try {
    const allCatagory = await Catagory.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "all Catagory fetched",
      allCatagory,
    });
  } catch (err) {
    console.log("error in tag fetch ", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get specific catagory page details

// top 10 catagory function pending

exports.catagoryPageDetails = async (req, res) => {
  try {
    //get catagory id
    const { catagoryId } = req.body;
    //get course for specfic catagory id
    const selectedCatagory = await Catagory.findById({ _id: catagoryId })
      .populate("course")
      .exec();
    //validation for coourse
    if (!selectedCatagory) {
      return res.status(404).json({
        success: false,
        message: "there is no avaliable course for this catagory",
      });
    }
    //get different catagory course
    const differentCategories = await Catagory.find({
      _id: { $ne: catagoryId },
    })
      .populate("course")
      .exec();
    //Top 10 selling course
     // due?
    //return res
    return res.status(200).json({
      success: true,
      message: "course if fetched successfully",
      data: {
        selectedCatagory,
        differentCategories,
      },
    });
  } catch (error) {
    console.log("error in tag fetch ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//...........................//.............................

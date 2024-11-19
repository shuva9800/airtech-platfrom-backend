const express = require("express")
const router = express.Router();

//import course related handler function from controller
const{courseCreate,getAllCourses, getSpecificCourse} = require("../controllers/coursehandler");
//catagory handler function
const{catagoryCreation,showAllCatagory,catagoryPageDetails}= require("../controllers/catagoryhandler");
//section handler function
const{sectionCreate,updateSection,deleteSection}= require("../controllers/sectionhandler");
//subsection handler function
const{createSubSection,updateSubSection,deleteSubSection}= require("../controllers/subsectionhandler");
//rating and review handler function
const{createRatingAndReview,getAverageRating,allRating}= require("../controllers/ratingandreviewhandler");
//authentacitation middleware function
const{checkAuthentication,student,admin,instractor} = require("../middleware/authorize");


//map handeler function with path
router.post("/createCourse",checkAuthentication,instractor,courseCreate );
router.post("/createSection", checkAuthentication,instractor,sectionCreate );
router.put("/updateSection", checkAuthentication,instractor,updateSection );
router.delete("/deleteSection", checkAuthentication,instractor,deleteSection );
router.post("/createSubSection", checkAuthentication,instractor,createSubSection );
router.put("/updateSubSection", checkAuthentication,instractor,updateSubSection );
router.delete("/deleteSubSection", checkAuthentication,instractor,deleteSubSection );
//get datails of specfic courses
router.post("/getSpecificCourse",getSpecificCourse);
//get all courses
router.get("/getAllCourses",getAllCourses);

//admin only field because catagory only created by admin only
router.post("/catagoryCreation",checkAuthentication,admin,catagoryCreation );
//get specific catagory details
router.post("/catagoryPageDetails",catagoryPageDetails );
//gaet all catagory details

router.get("/showAllCatagory",showAllCatagory );

//student only fielld because rating and review only giv student
router.post("/createRatingAndReview",checkAuthentication,student,createRatingAndReview );
//get average rating
router.get("/getAverageRating",getAverageRating );
router.get("/allRating",allRating );


module,exports= router;
































//exports route
module.exports = router;
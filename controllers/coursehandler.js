const coures = require("../models/courses")
const Category = require("../models/catagory")
const User = require("../models/user")
const {imageUploadToCloudinary} = require("../utility/imageUpload")
require("dotenv").config();
// 1.check for instractor line no:19 or near by
// exports.courseCreate = async (req,res)=>{
//     try{
//         // fetch data
//         const{courseName, courseDescription,whatYouWillLearn,price,catagory}= req.body;
//         console.log(courseName)
//         //get file
//         //  const file= req.files.thumbnil;
//         // validation                                                           //||!file 
//         if(!courseName || !courseDescription || !whatYouWillLearn || !price || !catagory  ){
//             return res.status(401).json({
//                 success: false,
//                 message:" all field to be field"
//             })
//         }
//         //???????
//          //check for instructor
//          const userId = req.findPerson.id;
//          //console.log("user id :-",userId)
//          const instructorDetails = await User.findById(userId);
//          //console.log("Instructor Details: " , instructorDetails);
//          //TODO: Verify that userId and instructorDetails._id  are same or different ?
//          if(instructorDetails._id !== userId){
//             console.log("instractor id and user id are not same")
//          }
 
//          if(!instructorDetails) {
//              return res.status(404).json({
//                  success:false,
//                  message:'Instructor Details not found',
//              });
//          }
//          console.log("instractor id-", instructorDetails._id)
//          //check given tags is valid or not 
//          const catagoryDetails = await tag.findById({_id:catagory});
//          if(!catagoryDetails){
//             return res.status(404).json({
//                 success:false,
//                 message:'Tag detils not found',
//             })
//          }
//          console.log("New course is:-", catagoryDetails._id)
//          //upload image to cloudniary
//          //const thumbnilImage = await imageUploadToCloudinary(file, process.env.FOLDER_NAME);
//          //Db entry for new course
//          const newCourse = await coures.create({
//             courseName,
//              courseDescription,
//              whatYouWillLearn,
//              price,
//              catagory:catagory,  //is needed tagDetails._id
//              //thumbnil:thumbnilImage.secure_url,
//              instructor:userId ,//action required?instructorDetails._id
//          })
      
//          //adding the new course  to user schema
//          await User.findByIdAndUpdate(
//             {_id:instructorDetails._id},
//                 {
//                     $push: {courses:newCourse.id,

//                 }
//             },
//             {new: true}
//         ).populate("courses")//?? needded?
//         .exec();
      

//         //update Tag schema
//         await tag.findByIdAndUpdate(
//             {_id:catagoryDetails._id},
//             {course: newCourse._id},
//             {new: true},
//         ).populate("course")//?? needded?
//         .exec();

//         return res.status(200).json({
//             success: true,
//             message:"Course created successfully"
//         })
//     }
//     catch(error){
//         console.log(error)
//         return res.status(500).json({
//             succcess: false,
//             message :"error occure in course creation"
//         })
//     }
// }
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
			status,
			instructions,
		} = req.body;
        console.log(req.body);

		// Get thumbnail image from request files
		//const thumbnail = req.files.thumbnailImage;

		// Check if any of the required fields are missing          	//!thumbnail ||
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});
		console.log("instractor dsetails-", instructorDetails);

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the tag given is valid
		const categoryDetails = await Category.findById({_id:category});
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}
		console.log("catagory details-", categoryDetails)
		// Upload the Thumbnail to Cloudinary
		// const thumbnailImage = await imageUploadToCloudinary(
		// 	thumbnail,
		// 	process.env.FOLDER_NAME
		// );
		// console.log(thumbnailImage);
		// Create a new course with the given details
		const newCourse = await coures.create({
			courseName,
			courseDescription,
			instractor:instructorDetails._id ,//instructorDetails._id
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			//thumbnail: thumbnailImage.secure_url,
			//status: status,
			//instructions: instructions,
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

exports.getAllCourses= async (req,res)=>{
    try{
        const allCourses = await coures.find({});
        if(!allCourses){
            return res.status(404).json({
                success: false,
                message:"there is no coures available"
            })
        }

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "error occure white all course data fetching"
        })
    }
}

//find specific courses by given id
exports.getSpecificCourse =async (req,res)=>{
    try{
        //fetch datamean course id
        const {courseid} =  req.body;
        //validation
        if(!courseid){
            return res.status(400).json({
                success:false,
                message: "course is not found"
            })
        }
        const courseDetails = await coures.findById({_id: courseid})
                                                .populate(
                                                    {
                                                    path: "instractor",
                                                    populate:{
                                                        path: "additionalInfo"
                                                    },
                                                    }
                                                )
                                                .populate({
                                                    path: "courseContent",
                                                    populate:{
                                                        path: "additionalInfo",
                                                    },
                                                })
                                                .populate("ratingandreview")
                                                .populate(
                                                    {
                                                        path: "studentEnroll",
                                                        populate:{
                                                            path: "additionalInfo"
                                                        },
                                                    }
                                                )
                                                .populate("catagory")
                                                .exec();
       
       if(!courseDetails){
        return res.status(400).json({
            success:false,
            message:`course is not found which course id is:- ${courseid}`,

        })
       }
       return res.status(200).json({
        success:true,
        message:"course fetch successfully",
        data: courseDetails,
       })                                       
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "error occure white  course data fetching by course id"
        })
    }

}
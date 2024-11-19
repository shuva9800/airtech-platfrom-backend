const Course = require("../models/courses");
const ratingAndReview = require("../models/rating&review");
const User = require("../models/user");
//user id panga in ratingandreview schemas

//create rating and review
exports.createRatingAndReview = async (req,res) =>{
   try{
    // fetch data and user id
        const userId = req.findPerson.id;
        const {rating, review ,courseid}= req.body;

    //validation
        if(!userId || !rating ||!review ||!courseid){
            return res.status(400).json({
                success: false,
                message: "invalid user id or empty rating and review field",
            })
        }
        //code is different with codehelp
    //check userid is bying the course or not
        const uid= new mongoose.Type.ObjectId(userId);
        if(!Course.studentEnroll.includes(uid)){
            return res.status(400).json({
                success:false,
                message:"rating and review is only for enroll students"
            });
        }
    //check user is already given rating and review
        const alreadydonerating = await ratingAndReview.findOne({
                                            user: userId,
                                            course: courseid,
        });
        if(alreadydonerating){
            return res.status(403).json({
                success:false,
                message: " you are already submit your rating and review"
            })
        }
   
        //create entry in db
        const ratingAndreviewfield = await ratingAndReview.create(
            {rating ,review,
                course: courseid,
                user: userId

            },
        );
        //update it to the course schema
        await Course.findByIdAndUpdate(
            {_id:courseid},
            {
                $push:{ratingandreview : ratingAndreviewfield._id}
            },
            {new: true},
        )
        //return response
        return res.status(200).json({
            success: true,
            message: "rating and review creater successfully updated"
        })
   }
   catch(error){
        return res.status(500).json({
            success: false,
            error:error.message,
        })
   }


}


//get average rating

exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await ratingAndReview.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},//rating
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//get all rating
exports.allRating = async (req,res) =>{
    try{
        //show course specific rating????
        const allrating = await ratingAndReview.find({})
                                            .sort({rating: "desc"})
                                            .populate(
                                                {
                                                    path: "user",
                                                    select: "firstName lastName email image",
                                                }
                                            )
                                            .populate({
                                                path: "course",
                                                select:"courseName",
                                            })
                                            .exec();
        // if(!allrating){
        //     return res.status(400).json({
        //         success: false,
        //         message: " there is no rating an review for this co"
        //     })
        // }
        return jres.status(200).json({
            success: true,
            message: "all rating and review fatching successfully",
            allrating
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error:error.message,
            message: "error in all reating fatching"
        })
    }
}
const {instance} = require("../config/razorpay");
const User = require("../models/user");
const Course = require("../models/courses");
const mailSendeToUser = require("../utility/mailSender");


//order creation for payment -->when we click in the buy button

exports.capturePayment = async (req,res)=>{
    try{
        //user id and course id fetch
        const {CourseId} = req.body;
        const userId = req.findPerson.id
        //validation
        if(!CourseId){
            return res.satus(400).json({
                success: false,
                message: "please provide valid CourseId",
            })
        }
        //valid course id or not
        let courseDetails;
      try{
             courseDetails = await Course.findById(CourseId);
            if(!validCourse){
                return res.status(400).json({
                    success: false,
                    message: "could not find the course"
                })
            }
         //user already payed for this course or not
         const uid = new mongoose.Type.ObjectId(userId);
         if(Course.studentEnroll.includes(uid)){
            return res.status(400).json({
                success: false,
                message: "user is already buy this course no need to buy again"
            })
         }


      }
      catch(error){
            console.log(error);
            return res.status(400).json({
                success: false,
                error: error.message,
                message: "occure error while user and course details fetching"

            })
      }       

        // order create
        const amount = courseDetails.price;
        currency = "INR";

        //create option
        const options = {
            amount :amount*100,
            currency,
            recipt: Math.random(Date.now()).toString(),
            notes :{
                user: userId,
                course:CourseId,
            },
        }
        try{
             //initiate the payment using razorpay
            const paymentResponse =await instance.orders.create(options);
            console.log(paymentResponse);
        }
        catch(error){
            console.log(error);
            return res.status(400).json({
                success: false,
                error: error.message,
                message: "could not initiate order"
            })
        }
        //return response
        return res.satus(200).json({
            success: true,
            message: "order initiate successfully",
            courseName: courseDetails.courseName,
            courseDescription: courseDetails.courseDescription,
            thumbnil: courseDetails.thumbnil,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "capture payment failed"
        })
    }
}

//verify signature

exports.verifySignature = async (req,res)=>{
    //this signature is present in server
    const webhookSecret = "12345678";
    //coming sectrt key from razor pay
    const signature = req.headers["x-razorpay-signature"];
    //part of razor pay return hash webhook secret
    const shasum =  crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
                //fulfil the action

                //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$push:{studentEnroll: userId}},
                                                {new:true},
                );

                if(!enrolledCourse) {
                    return res.status(500).json({
                        success:false,
                        message:'Course not Found',
                    });
                }

                console.log(enrolledCourse);

                //find the student andadd the course to their list enrolled courses me 
                const enrolledStudent = await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$push:{courses:courseId}},
                                                {new:true},
                );

                console.log(enrolledStudent);

                //mail send krdo confirmation wala 
                const emailResponse = await mailSendeToUser(
                                        enrolledStudent.email,
                                        "Congratulations from CodeHelp",
                                        "Congratulations, you are onboarded into new CodeHelp Course",
                );

                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and COurse Added",
                });


        }       
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }


}
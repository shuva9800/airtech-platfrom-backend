const mongoose = require('mongoose');
const sendMail = require("../utility/mailSender")

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
      
})
//a function -> to send emails
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await sendMail(email, "Verification Email from StudyNotion", otp);//change
        console.log("Email sent Successfully: ", mailResponse);
    }
    catch(error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}

otpSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
}) 





module.exports = mongoose.model("OTP", otpSchema);
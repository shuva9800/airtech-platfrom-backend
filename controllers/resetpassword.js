const User = require("../models/user");
const mailSender = require("../utility/mailSender");

//reset password token
exports.resetPasswordToken = async (req,res) =>{
    try{
        const {email}= req.body;
        const user = await User.findOne({email});
        //check user is valid or not
        if(!user){
            return res.status(401).json({
                success: false,
                message:" user is not oregister to our portel"
            })
        }
        //token generete
        const token = crypto.randomUUID();
        //update user by token and password expiry time
        const updateDetails = await User.findByIdAndUpdate({_id:user._id},
             {token:token,
            resetPasswordExpiry:Date.now()+ 5*60*1000},
             {new:true});
        
        //URL create
         const url = `http://localhost:3000/update-password/${token}` 
         //mailsent to user
          await mailSender(email, "reset password link",
            `password reset link: ${url}`)
        // responce
        
        return res.status(200).json({
            success:false,
            message:"reset password link is sent to your email please check"
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error occure for generating link for passwort reset"
        })
    }
}

//reset password

exports.resetPassword = async (req,res) =>{
    try{
         //data fetch
         const { newPassword,confirmnewPassword,token} = req.body;

         //validation
         if(newPassword !== confirmnewPassword){
             return res.status(400).json({
                 success: false,
                 message: "newpassword and confirmnewPassword does not match"
             })
            }
         //get user details from db
         const userDetails = await User.findOne({token:token});
 
 
         //if no entry -invalid token
         if(!userDetails){
             return res.status(401).json({
                success: false,
                message: "invalid token"
             })
         }
 
         //token time check
         if(userDetails.resetPasswordExpiry < Date.now()){
            return res.status(401).json({
                success: false,
                message: "token is expired re generate it"
             })
         }
 
         //has password 
             const updatedPassword = await bcrypt.hash(newPassword,10);
             const passwordchange = await User.findByIdAndUpdate({_id:userDetails._id},{password: updatedPassword},{new: true})
             //const responseOfMailsend = await mailSender(userDetails.email ,"passwordchange-complete","password update successfully" );
             return res.status(200).json({
                 success:true,
                 message: "'password update successfully",
                 passwordchange,
                 responseOfMailsend,
 
             })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error occure for password update"
        })
    }
}
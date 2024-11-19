const jwt =require("jsonwebtoken");
require("dotenv").config();


//authorizations
exports.checkAuthentication = async (req,res,next) =>{
try{
    const token = req.body.token || req.cookies.shuvaCookie || req.header("Authorization").replace('Bearer ', '');

    if(!token || token===undefined){
        return res.status(401).json({
            success: false,
            message:"token is missing or invalid"
        })
    }

    try{
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decode);
        req.findPerson= decode;
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occure while decode token"
        })
    }
    next();

}
catch(error){
    console.log(error);
    return res.status(401).json({
        success:false,
        message: " error while token checking for auhhentatication"
    })
}
}

//isStudent
exports.student = async (req,res,next)=>{
try{
    if(req.findPerson.accountType !== "Student"){
        return res.status(401).json({
            success: false,
            message: "route is protected for Student Only"
        })
    }
  
}
 catch(error){
    console.log(error);
    return res.status(401).json({
        success:false,
        message: " error for student dashboard"
    })
}  
next();
    
}

//is Admin
exports.admin = async (req,res,next)=>{
    try{
        if(req.findPerson.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "route is protected for Admin Only"
            })
        }
      
    }
     catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message: " error for Admin dashboard"
        })
    }  
    next();
        
    }

//is Instractor
exports.instractor = async (req,res,next)=>{
    try{
        if(req.findPerson.accountType !== "Instractor"){
            return res.status(401).json({
                success: false,
                message: "route is protected for Instractor Only"
            })
        }
      
    }
     catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message: " error for Instractor dashboard"
        })
    }  
    next();
        
    }
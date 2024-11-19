const subSection = require("../models/subsection");
const Section = require("../models/section");
const {imageUploadToCloudinary}= require("../utility/imageUpload")
require("dotenv").config();


//create subSection
exports.createSubSection = async (req,res)=>{
    try{
        //date fetch
        const {title,timeduration,description,sectionId} = req.body;
        //video file extract
        const video = req.files.videoFile;
        //validating

        if(!title ||!timeduration || !description ||!sectionId || !video){
            return res.status(400).json({
                success: false,
                message:" all are required"
            })
        }
        //video upload in cloudinary

        const videouploadtoCloudinary = await imageUploadToCloudinary(video, process.env.FOLDER_NAME);
        //create subsection
        const createSubSection = await subSection.create({
            title,
            timeduration,
            description,
            videoUrl:videouploadtoCloudinary.secure_url,
        })

        //update it to section schema
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push:{
                    subsection:createSubSection._id,
                 }
             },
             {new:true},
        ).populate("subsection")
        .exec();
        //return responce
        return res.status(200).json({
            success: true,
            message: "subsection create successfullyu",
            createSubSection,
        })

    }
    catch(error){
        console.log("error in create subsection", error)
        return res.status(500).json({
            success: false,
            message: "error while creating subsection",
            error: error.message,
        })
     }
}

//HW: update subsection & delete subsection

//update subsection
exports.updateSubSection = async (req,res)=>{
    try{
        //fetch data
        const {title,timeduration,description,subsectionId} = req.body;
        const video = req.files.videoFile;
      
        //validation
      
        if(!title ||!timeduration || !description ||!subsectionId || !video){
            return res.status(400).json({
                success: false,
                message:" all are required"
            })
        }
          //upload video to cloud
          const videouploadtoCloudinary = await imageUploadToCloudinary(video, process.env.FOLDER_NAME);

        //updating section
        const updatedSubSection = await Section.findByIdAndUpdate(
            {subsectionId},
            {
                title: title,
                timeduration: timeduration,
                description: description,
                videoUrl: videouploadtoCloudinary,
            },
            {new:true}
        
        )
        //responce return
        return res.status(200).json({
            success: true,
            message:" subsection updated successfully",
            updatedSubSection,
        })

    }
    catch(error){
        console.log("error in updateSection", error)
        return res.status(500).json({
            success: false,
            message: "error while Updating section ",
            error: error.message,
        })
    }
}

//delete subsection
//action needded???????
exports.deleteSubSection = async (req,res)=>{
    try{//fetch subsection Id
        const subsectionId = req.params.id;
        //find sub section
        await subSection.findByIdAndDelete(subsectionId);
     
        // ??? we need to update course schema
        await Section.updateMany(
            {subsection :subsectionId},
            {
                $pull:{
                    subsection :subsectionId,
                }
            },
            {new:true},
        )
     
        //responce return
        return res.status(200).json({
         success: true,
         message:" subsection delete successfully",
         })

    }
    catch(error){
        console.log("error in delete subsection", error)
            return res.status(500).json({
                success: false,
                message: "error while deleting subsection",
                error: error.message,
            })
    }
}

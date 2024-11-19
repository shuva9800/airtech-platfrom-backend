const cloudinary = require('cloudinary').v2

exports.imageUploadToCloudinary = async (file,folder,quality,height,)=>{
    const option={folder};
    if(quality){
        option.quality = quality
    }
    if(height){
        otpCreation.height = height
    }
    option.resource_type = "auto"

    return await cloudinary.uploader.upload(file.tempFilePath, option);
}
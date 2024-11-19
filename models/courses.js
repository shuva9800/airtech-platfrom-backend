const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
 courseName:{
   type: String,
   trim: true,
 },
 courseDescription:{
    type: String,
    trim: true,
 },
 instractor:{
   type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
 },
 whatYouWillLearn:{
   type: String,
 },
 courseContent:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }
 ],
 ratingandreview:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    }
 ],
 price:{
    type:Number,
    required: true,
 },
 thumbnil:{
    type: String,
 },
 catagory:{
   type: mongoose.Schema.Types.ObjectId,
    ref: "Catagory",
    //required: true,
 },
 tags:{
   type: mongoose.Schema.Types.ObjectId,
   ref: "Tag"
 },
 studentEnroll:[
    {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User",
       
    }
 ]



})


module.exports= mongoose.model("Course", courseSchema);
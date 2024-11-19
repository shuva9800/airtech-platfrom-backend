const mongoose = require('mongoose');


const courseProgresshema = new mongoose.Schema({
   courseID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
   },
   completedVidows:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subsection"
    }
   ]


})


module.exports= mongoose.model("CourseProgress", courseProgresshema);
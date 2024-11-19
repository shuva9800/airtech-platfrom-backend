const mongoose = require('mongoose');


const subsectionSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: true,
    },
    timeduration:{
        type: Number,
        required: true,
    },
    description:{
       type: String,
        required: true,
    },
    videoUrl:{
        type: String,
        required: true,
    }

  
})


module.exports= mongoose.model("Subsection", subsectionSchema);
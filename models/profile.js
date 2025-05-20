const mongoose = require('mongoose');


const profileSchema = new mongoose.Schema({
    gender:{
        type: String,
        // required: true,
    },
    dateOfbirth:{
        type: String,
    },
    aboute:{
       type: String,
        trim:true
    },
    contactNumber:{
        type: Number,
        trim:true,
    }


})


module.exports= mongoose.model("Profile", profileSchema);
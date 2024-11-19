const mongoose = require('mongoose');


const catagorySchema = new mongoose.Schema({
  name:{
   type: String,
    required: true
    
  },
  description:{
    type: String,
    required:true
  },
  course: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
}],

  
})


module.exports= mongoose.model("Catagory", catagorySchema);
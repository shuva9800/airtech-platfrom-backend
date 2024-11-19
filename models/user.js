const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        firstName :{
            type: String,
            required: true,
            trim: true,
        },
        lastName:{
            type: String,
            required: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            trim: true,
        },
        password:{
           type: String,
            required: true,
        },
        confirmpassword:{
            type: 'string',
            required: true,
        },
        accountType:{
           type: String,
            enum:["Student","Admin","Instractor"],
            required: true,
        },
        additionalInfo:{
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Profile"
        },
        courses:
           [ {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Course"
             }
        ],
        image:{
           type: String,
            requiered:true,

        },
        //add on active and aprove key
        active: {
			type: Boolean,
			default: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
        token:{
            type: String,
        },
        resetPasswordExpiry:{
            type: Date,
        },
        coureseProgress:[
            {
                type:mongoose.Schema.Types.ObjectId,
                // required: true,
                ref: "CourseProgress"
            }
        ],
},
// Add timestamps for when the document is created and last modified
{ timestamps: true }
)

module.exports = mongoose.model("User",userSchema);
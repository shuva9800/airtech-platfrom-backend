const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const {dbconnect} = require('./config/database');
const cloudinary = require("./config/cloudinaryupload");

const port= process.env.PORT || 4000;
//import route and mounte
const profilRouts = require("./routs/userporpuse");
const courseRouts = require("./routs/courseporpuse");
const paymentRouts = require("./routs/paymentpurpose");
const signupRouts = require("./routs/signuppurpose");

//parsing middleware
app.use(express.json());


app.use(cookieParser());

//database conection
dbconnect();
//cloud connection
cloudinary();




app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)
//file upload
app.use(fileUpload(
    {
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
));

//routs
app.use("/api/v1/auth",signupRouts);
app.use("/api/v1/course",courseRouts);
app.use("/api/v1/payment",paymentRouts);
app.use("/api/v1/profil",profilRouts);


app.listen(port, ()=>{
    console.log(`applicetion started successfully at port ${port}`);

})

app.get("/", (req,res)=>{
    return res.json({
        success: true,
        message:"server is running......"
    })
})






// const express = require("express");
// const app= express();
// require("dotenv").config();

// const PORT= process.env.PORT || 4000;
// //middleware
// app.use(express.json());
// const fileupload= require("express-fileupload");
// app.use(fileupload(
//     {
//         useTempFiles : true,
//         tempFileDir : '/tmp/'
//     }
// ));

// app.listen(PORT, ()=>{console.log(`app started successfully at ${PORT}`)});

// //database connection
// const {dbconnect} = require("./config/database");
// dbconnect();
// //cloudinary connection
// // const cloudbase= require("./config/cloudinary");
// // cloudbase();

// const uploadrouter= require("./routs/signuppurpose");
// app.use("/api/v1/auth", uploadrouter);



// app.get("/", (req,res)=>{
//     res.send(`<h1>WELL COME TO HOME PAGE</h1>`);
// })

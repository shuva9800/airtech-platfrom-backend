const mailSender = require("../utility/mailSender");
require("dotenv").config;

exports.contactUshandler = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;
    
    //send mail to admin
    await mailSender(process.env.MAIL_USER,
        "New Contact Us Message",
        `
        <h2>New message received:</h2>
        <p><strong>Name:</strong> ${firstName } ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Email:</strong> ${phoneNumber}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `

    )


    //send feed back from admin of recivd mail
    await mailSender(
      email,
      "We received your message!",
      ` <h2>Hello ${firstName} ${lastName},</h2>
        <p>Thank you for contacting us. Here's a copy of your message:</p>
        <p>${message}</p>
        <p>We will get back to you shortly.</p>`
    );
    return res.status(400).json({
        success:true,
        message:"email send successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to sent message to te admin",
      error: error.message,
    });
  }
};

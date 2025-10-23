
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
 
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,                
    secure: false,            
    auth: {
      user: "deepsikhapradhan.654@gmail.com",
      pass: "isju meov onvq vkzj",    
    },
  });


  await transporter.sendMail({
   from: '"TravelApp" <deepsikhapradhan.654@gmail.com>',

    to,
    subject,
    html,
  });
};

module.exports = sendEmail;

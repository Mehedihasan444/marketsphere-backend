import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
    // secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.sender_email,
      pass: config.sender_app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: config.sender_email, 
    to: email, 
    subject: 'Reset your password within ten mins!', 
    text: "This mail from TECHNEST to reset your password. Reset your password within 10 minutes other wise this like will be invalid and you have to try age from the beginning.", // plain text body
    html, 
  });
};



export const EmailHelper = {
  sendEmail,
};
import { RequestHandler } from "express";
import sendEmail from "../utils/sendEmail";

/**
 * @desc - Send user message to support email
 * @route - POST api/contact
 * @access - Public
 */
export const contactUs: RequestHandler = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  //send set pass token
  const emailOptions = {
    replyTo: email,
    subject: "Message from our user",
    to: "support@atwelia.com",
    body: `
                <p>User's name:  ${name}, </p>
                <p>User's email:  ${email}, </p>
                <p>Message: ${message}</p>              
                             
                `,
  };
  //don't wait
  sendEmail(emailOptions);

  res.status(201).json({
    message: "Message sent",
  });
};

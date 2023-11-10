"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUs = void 0;
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
/**
 * @desc - Send user message to support email
 * @route - POST api/contact
 * @access - Public
 */
const contactUs = async (req, res) => {
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
    (0, sendEmail_1.default)(emailOptions);
    res.status(201).json({
        message: "Message sent",
    });
};
exports.contactUs = contactUs;

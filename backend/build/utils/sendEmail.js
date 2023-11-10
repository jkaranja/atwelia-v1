"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
//smtp protocol sends email to mailbox
//pop3 retrieves mail from from mail server
const sendEmail = async ({ from, subject, to, replyTo, body }) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer_1.default.createTransport({
        name: process.env.SMTP_HOST,
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: from || process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const htmlBody = `

  <body style="margin:0;padding:0;"> 
        <table
          role="presentation"
          style="width:100%;background-color: #f5f8fa; font-size: 16px; line-height: 24px;font-family: Helvetica,Arial,sans-serif; "
        >
        <tr><td colspan="3" style="height:45px;"></td> </tr>
          <tr>
            <td >            
              
            </td>
             <td style="padding:30px 30px; width: 40%; min-width: 350px; background-color: white;">
             ${body}              
            </td>
             <td>           
              
            </td>
          </tr>
          <tr style="font-size: 12px; color:#65735b;">
            <td></td>
            <td align="center"style=" padding-top:30px; width: 40%; ">
              
              <p>
                <span><a href="https://atwelia.com/contact" style="color: #65735b;">Unsubscribe</a></span> |
                <span><a href="https://atwelia.com/about" style="color: #65735b;">About us</a></span> | 
                <span><a href="https://atwelia.com/contact" style="color: #65735b;">Contact support</a></span>  
                
              </p>
              <p>
                Email us: support@atwelia.com, WhatsApp: +254799295587
              </p>
              <p  id="date">
                 <script> 
                  document.getElementById("date").innerHTML = ${"@" + new Date().getFullYear() + " " + "Mui"}
                 </script>
              </p>
            </td>
            <td></td> 
          </tr>
          <tr><td colspan="3" style="height:45px;"></td> </tr>
        </table>
      </body>
`;
    const mailOptions = {
        from: `"Atwelia" <${from || process.env.SMTP_USER}>`,
        to: !Array.isArray(to) && to,
        bcc: Array.isArray(to) && to,
        subject: subject,
        replyTo: replyTo || "",
        html: htmlBody, // html email/body
        // attachments: [
        //   // {   filename: 'text2.txt'//optional// filename & content type will be derived from path
        //       path: '/path/to/file.txt'
        //   },{path: '/another file'}
        // ]
    };
    try {
        // verify connection configuration fist
        await transporter.verify();
        console.log("Server is ready to take our message");
        const response = await transporter.sendMail(mailOptions);
        transporter.close();
        console.log("Email sent successfully: ", response);
        return true;
    }
    catch (error) {
        console.error("Error: ", error); //console.error logs error, same as .log
        return null;
    }
};
exports.default = sendEmail;

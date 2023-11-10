import { Client } from "africastalking-ts";

const credentials = {
  apiKey: process.env.SMS_API_KEY,
  username: process.env.SMS_USER,
};

interface SendMessage {
  to: string[] | string;
  message: string;
}

const sendMessage = async ({ to, message }: SendMessage) => {
  try {
    // Initialize the SDK
    const client = new Client(credentials);

    const options = {
      // Set the numbers you want to send to in international format
      to, //string or array//note: to must have this format: +254....., else throws error. Must be in try catch to catch this err
      // Set your message
      message,
      // Set your shortCode or senderId
      from: process.env.SMS_SENDER_ID,
    };

    console.log("Gateway is ready to send our message");
    // That’s it, hit send and we’ll take care of the rest
    const response = await client.sendSms(options);

    console.log("Message sent successfully: ", response);

    return true;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export default sendMessage;

//example response
// {
//     "SMSMessageData": {
//         "Message": "Sent to 1/1 Total Cost: KES 0.8000",
//         "Recipients": [{
//             "statusCode": 101,
//             "number": "+254711XXXYYY",
//             "status": "Success",
//             "cost": "KES 0.8000",
//             "messageId": "ATPid_SampleTxnId123"
//         }]
//     }
// }

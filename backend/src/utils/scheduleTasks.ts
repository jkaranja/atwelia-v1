import * as cron from "node-cron";
import Notification, { PushStatus } from "../models/Notification";
import Expo, { ExpoPushMessage } from "expo-server-sdk";
import sendPushNotification from "./sendPushNotification";

const messages: ExpoPushMessage[] = [];

const scheduleTasks = () => {
  cron.schedule("* * * * * *", async () => {
    //console.log('running a task every two minutes');

    const notifications = await Notification.find().exec();

    await Promise.all(
      notifications.map(async (notification) => {
        try {
          //Expo is valid
          if (Expo.isExpoPushToken(notification.pushToken)) {
            //check if more than 3 mins have passed since a new notification message arrived for this user
            //This will delay sending notification by t least 3 min. Gives user time to see them and clear them if they have site/app open
            if (
              Date.now() - new Date(notification.updatedAt).getTime() >=
              3 * 60 * 1000
            ) {
              //send inbox notification if there is at least 1 new notification message-> pending
              if (
                notification.inbox.some(
                  (message) => message.pushStatus === PushStatus.Pending
                )
              ) {
                messages.push({
                  to: notification.pushToken, //An Expo push token or an array of Expo push tokens specifying the recipient(s) of this message.
                  title: "", //The title to display in the notification. Often displayed above the notification body
                  body: "This is a test notification", //The message to display in the notification.
                  //data: { id: recipient, url: "/listings" },, //A JSON object up to 4KiB; else "Message Too Big" error.
                });

                //update all inbox messages status as sent
                await Notification.findByIdAndUpdate(notification._id, {
                  "inbox.status": PushStatus.Sent,
                });
              }

              //send tours notification if there is at least 1 new notification message-> pending
              if (
                notification.tours.some(
                  (message) => message.pushStatus === PushStatus.Pending
                )
              ) {
                messages.push({
                  to: notification.pushToken, //An Expo push token or an array of Expo push tokens specifying the recipient(s) of this message.
                  title: "", //The title to display in the notification. Often displayed above the notification body
                  body: "This is a test notification", //The message to display in the notification.
                  //data: { id: recipient, url: "/listings" },, //A JSON object up to 4KiB; else "Message Too Big" error.
                });

                //update all tours messages status as sent
                await Notification.findByIdAndUpdate(notification._id, {
                  "tours.status": PushStatus.Sent,
                });
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      })
    );

    sendPushNotification(messages);
  });
};

scheduleTasks();

// Allowed fields
//  # ┌────────────── second (optional) //0-59// * Means->run task every sec of every min(if other fields are *s)
//  # │ ┌──────────── minute //0-59// * Means->run task every min of every hour(if other fields are *s)
//  # │ │ ┌────────── hour //0-23 // * Means->run task every hour of every day(if other fields are *s)
//  # │ │ │ ┌──────── day of month //1-31
//  # │ │ │ │ ┌────── month //1-12 (or names) eg 1 or January
//  # │ │ │ │ │ ┌──── day of week //0-7 (or names, 0 or 7 are sunday) eg 7 or Sunday
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *

//a field(or *) can be  * //means run every sec, min, hr
//can be a value eg '5 * * * *' run every 5th sec of every min or '* 10 * * *'//every sec of 10th min
//a field(or *) can be names eg '* * * January,September Sunday' //running on Sundays of January and September
//a field(or *) can be a range eg '1-5 * * * *'// every sec from 1-5 of each minute
//can be multiples values to run the task in those specific values eg '1,2,4,5 * * * *' //running every minute 1, 2, 4 and 5
//can be step values eg '*/2 * * * *' //run a task every two minutes
//can remove stars to exclude running tasks every sec, min, day etc

export default scheduleTasks;

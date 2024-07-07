import {Injectable} from '@angular/core';
import {PushNotifications} from '@capacitor/push-notifications';
import {LocalNotifications, ScheduleOptions} from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() {}

  async scheduleLocalNotification() {
    console.log("scheduleLocalNotification");
    const schedOpt: ScheduleOptions = {
      notifications: [
        {
          title: "Welcome to Omni Method",
          body: "Please visit announcements on community tab to view an introductory welcome video.",
          id: 1
        }
      ]
    };
    LocalNotifications.schedule(schedOpt);
  }

  async pushNotificationPermissions() {
    console.log("pushNotificationPermissions");

    // checkPermissions()
    let permStatus = await PushNotifications.checkPermissions();
    console.log("permStatus", permStatus);

    // requestPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

}

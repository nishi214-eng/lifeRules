import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function schedulePushNotification(
    notificationTitle:string,
    notificationTxt:string,
    endTaskDate:Date) 
  {
    let endTime = endTaskDate.getTime();// タスクの終了時刻をミリ秒形式に変換
    let nowTime = new Date().getTime(); // 端末の現在時刻を取得しミリ秒に変換
    let sendTime = (endTime - nowTime) / 1000 + 4; // 終了時間-現在時刻を秒単位に変換
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationTitle,
        body: notificationTxt,
        //data: { data: 'goes here', test: { test1: 'more data' } },
      },
      trigger: { seconds:sendTime},
    });
}
  
export async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }
  
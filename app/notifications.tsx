import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// プッシュ通知を予約する関数。引数：通知のタイトル,通知のテキスト,通知を送る日付と時刻
// todo：タスクが作成された際にこの関数を呼び出し、ローカルDBに返り値のnotificationIdを保存するように更新
export const schedulePushNotification = async (
    notificationTitle:string,
    notificationTxt:string,
    sendDate:Date) =>
  {
    let endTime = sendDate.getTime();// タスクの終了時刻をミリ秒形式に変換
    let nowTime = new Date().getTime(); // 端末の現在時刻を取得しミリ秒に変換
    let sendTime = (endTime - nowTime) / 1000 ; // 終了時間-現在時刻を秒単位に変換
    alert (sendTime);
    try{
      const notificationId:string = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: notificationTxt,
        },
        trigger: {seconds:sendTime},
      });
      return notificationId; // 通知を識別するid リターン先でローカルdbに保存
    }catch(error){
      console.log(error);
    }
}

// 通知をキャンセルする関数。引数：通知のid
// todo：タスクの完了・削除時にこの関数を実行。成功したらローカルDBから通知のidを削除するように更新
export const cancelPushNotification = async (notificationId:string) => { // ローカルDBに保存されている通知のidを渡す
  try{
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }catch(error){
    console.log(error);
  }
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
  
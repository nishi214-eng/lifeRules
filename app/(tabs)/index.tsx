//import { Image, StyleSheet, Platform } from 'react-native';
import { Platform } from 'react-native';
//import { HelloWave } from '@/components/HelloWave';
//import ParallaxScrollView from '@/components/ParallaxScrollView';
//import { ThemedText } from '@/components/ThemedText';
//import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button } from 'react-native';
//import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
//import Constants from 'expo-constants';
import { schedulePushNotification } from '../notifications';
import { registerForPushNotificationsAsync } from '../notifications';
import { requestOpenAi } from '@/feature/requestOpenAi';
import firestore from '@react-native-firebase/firestore';
import '@react-native-firebase/firestore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  let endTime = new Date();
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Button
        title="生成"
        onPress={async () => {
          await requestOpenAi("titleTest","こんにちは"); // 通知のタイトル,テキスト,何秒後に送るかを指定
        }}
      />
    </View>
  );
}
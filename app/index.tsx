import { Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Button, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { schedulePushNotification } from './notifications';
import { registerForPushNotificationsAsync } from './notifications';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/login';
import Register from './pages/register';
import HomeScreen from './pages/home';
import TaskHandle from './pages/task';
import EventHandle from './pages/event';
import ProfileScreen from './pages/profile';

//import Constants from 'expo-constants';
import { requestOpenAi } from '@/feature/requestOpenAi';

import { addTask } from '@/feature/uploadFirestore';
import AiTask from './pages/aitask';
//import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Task: undefined;
  Event: undefined;
  Profile: undefined;
  AiTask: { 
    tasks: { 
      aitask: string; 
      deadlineDate: string; 
      deadlineTime: string; 
      aipriority: string; 
    }[];  // AiTask now expects an array of tasks
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const endTime = new Date();

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
    <>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Task" component={TaskHandle} />
        <Stack.Screen name="Event" component={EventHandle} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AiTask" component={AiTask} />
      </Stack.Navigator>
    </>

  );
}

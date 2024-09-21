import firestore from '@react-native-firebase/firestore';
import { auth } from '@/app/(tabs)/firebaseConfig';
export const addTask = async (
  taskTitle:string,
  dete:string,
  time:string,
  notificationId?:string,
  selectedPriority?:string,
  selectedTag?:string
) => {
    let uid = auth.uid
    await firestore().collection('task').doc(uid).set({
      taskTitle: taskTitle,
      selectedPriority: selectedPriority,
      dete: dete,
      time: time,
      selectedTag:selectedTag,
      notificationId:notificationId
    });
};
  

export const addEvent = async (
  eventTitle:string,
  dete:string,
  time:string,
  notificationId:string
) => {
  let uid = auth.uid
  await firestore().collection('event').doc(uid).set({
      eventTitle: eventTitle,
      dete: dete,
      time: time,
      notificationId:notificationId
    });
};
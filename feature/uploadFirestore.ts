import { auth } from '@/app/(tabs)/firebaseConfig';
import { db } from '@/app/(tabs)/firebaseConfig';
import firestore from '@react-native-firebase/firestore';

export const addTask = async (
  taskTitle:string,
  dete:string,
  time:string,
  notificationId:string,
  selectedPriority:string | null,
  selectedTag:string | null
) => {
    let uid = auth.currentUser?.uid;
    console.log(uid);
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
  let uid = auth.currentUser?.uid;
  await firestore().collection('task').doc(uid).set({
      eventTitle: eventTitle,
      dete: dete,
      time: time,
      notificationId:notificationId
    });
};
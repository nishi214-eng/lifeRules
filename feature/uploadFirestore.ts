import { auth } from "@/app/(tabs)/firebaseConfig";
import { db } from "@/app/(tabs)/firebaseConfig";
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

// Firestoreにユーザーごとのコレクションを作成してタスクを追加する関数
export const addTask = async (
  taskTitle: string,
  date: string,
  time: string,
  notificationId: string,
  selectedPriority: string | null,
  selectedTag: string | null
) => {
  // ユーザーのuidを取得
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.error('User is not authenticated');
    return;
  }

  try {
    // Firestoreの"users/{uid}/tasks"コレクションに新しいタスクを追加
    const docRef = await addDoc(collection(db, 'users', uid, 'tasks'), {
      taskTitle: taskTitle,
      date: date,
      time: time,
      notificationId: notificationId,
      selectedPriority: selectedPriority,
      selectedTag: selectedTag,
    });
    console.log('Task successfully added with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding task: ', error);
  }
};


export const addEvent = async (
  eventTitle: string,
  dete: string,
  time: string,
  notificationId: string
) => {
  // ユーザーのuidを取得
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.error('User is not authenticated');
    return;
  }
  try {
    // Firestoreの"users/{uid}/events"コレクションに新しいタスクを追加
    const docRef = await addDoc(collection(db, 'users', uid, 'events'), {
      eventTitle: eventTitle,
      dete: dete,
      time: time,
      notificationId: notificationId
    });
    console.log('Task successfully added with UID: ', docRef.id);
  } catch (error) {
    console.error('Error adding task: ', error);
  }
};
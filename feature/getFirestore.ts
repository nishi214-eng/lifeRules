import { db,auth } from "@/app/(tabs)/firebaseConfig"
import { getDocs,collection } from "firebase/firestore"
interface Task {
    taskTitle: string;
    date: string;
    time: string;
    notificationId: string;
    selectedPriority: string | null;
    selectedTag: string | null;
}

export const getTaskData = async () =>{
    // DBの参照を取得
    let uid = auth.currentUser?.uid //直近のログインユーザのuidを取得
    if(!uid){
        throw new Error("User is not authenticated")
    }
    const tasks: any[] = []; // タスクを保持する配列
    try{
        const querySnapshot = await getDocs(collection(db, "users", `${uid}`, "tasks")); // 全件取得
        // forを使って非同期で全てのドキュメントを処理
        for (const doc of querySnapshot.docs) {
            const data = doc.data() as Task; // データの型を指定
            tasks.push({ id: doc.id, ...data }); // ドキュメントのidと共にデータを配列にプッシュ
        }
        
        //return(tasks);
    }catch(error){
        console.error;
    }
    return tasks
}

interface Event {
    eventTitle: string;
    date: string;
    time: string;
    notificationId: string;
}
export const getEventsData = async () =>{
    // DBの参照を取得
    let uid = auth.currentUser?.uid //直近のログインユーザのuidを取得
    if(!uid){
        throw new Error("User is not authenticated")
    }
    const events: any[] = []; // タスクを保持する配列
    try{
        const querySnapshot = await getDocs(collection(db, "users", `${uid}`, "events")); // 全件取得
        // forを使って非同期で全てのドキュメントを処理
        for (const doc of querySnapshot.docs) {
            const data = doc.data() as Event; // データの型を指定
            events.push({ id: doc.id, ...data }); // ドキュメントのidと共にデータを配列にプッシュ
        }
    }catch(error){
        console.error;
    }
    return events
}
import { db,auth } from "@/app/(tabs)/firebaseConfig"
import { getDocs,collection,doc,getDoc } from "firebase/firestore"
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

interface Task {
    taskTitle: string;
    date: string;
    time: string;
    notificationId: string;
    selectedPriority: string | null;
    selectedTag: string | null;
}

export const getFriendTaskData = async () =>{
    const uid = "SxDXLl8zuVSbIb1Sc0LhP8TT5BB3"; // フレンドのUIDを取得

    try {
        const querySnapshot = await getDocs(collection(db, "users", uid, "userName")); // ドキュメントのリファレンスを指定
        if (!querySnapshot.empty) {
            const firstDocData = querySnapshot.docs[0].data(); // 1番目のドキュメントのデータを取得
            
            // 先頭要素を返す（例えば、'name'フィールドがあると仮定）
            return firstDocData.userName; // 'name'フィールドを返す
        } else {
            return null; // ドキュメントが存在しない場合
        }
    } catch (error) {
        console.error("Error fetching friend name: ", error);
        return null; // エラーが発生した場合はnullを返す
    }
}

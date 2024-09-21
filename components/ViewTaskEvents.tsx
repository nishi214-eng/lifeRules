import { Text, StyleSheet, Dimensions, View, } from 'react-native';
import { Button } from 'react-native-paper';
import { cancelPushNotification } from '@/app/notifications';
import { deleteDoc,doc } from 'firebase/firestore';
import { db } from '@/app/(tabs)/firebaseConfig';
import { auth } from '@/app/(tabs)/firebaseConfig';
interface Task {
    id:string,
    taskTitle: string;
    date: string;
    time: string;
    notificationId: string;
    selectedPriority: string | null;
    selectedTag: string | null;
}
    export const ViewTask = ({ task }: { task: Task }) => {
        const deleteTask = async() => {
            let uid = auth.currentUser?.uid 
            // Firestoreからタスクを削除
            await deleteDoc(doc(db, "users", `${uid}`, "tasks", task.id));
            await cancelPushNotification(task.notificationId);
            alert ("タスクを削除しました")
        }
        return (
            <>
                <View style={{ height: 20 }} />
                <View style={styles.taskbox}>
                    <View style={styles.taskInfo}>
                        <View style={styles.tasktitlebox}>
                            <Text style={styles.taskText} numberOfLines={2}>
                                {task.taskTitle}
                            </Text>
                        </View>
                        <View style={styles.importance}>
                            <Text style={styles.importanceValue}>重要度: {task.selectedPriority}</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text>{task.selectedTag}</Text>
                        </View>
                    </View>
                    <Text style={styles.taskstartText}>
                        タスク開始: {task.date}
                    </Text>
                </View>
                <View style={styles.taskInfo}>
                    <Text style={styles.taskstartText}>タスク開始: 2024年9月21日 22:30~</Text>
                    <Button onPress={deleteTask} style={styles.deleteButton}>
                        <Text style={styles.completetask}>タスク完了</Text>
                    </Button>
                </View>
            </>
        );
    };

    interface Event {
        eventTitle:string,
        date:string,
        time:string,
        notificationId:string
    }
    
    export const ViewEvent = ({ event }: { event: Event }) => {
        return (
            <>
                <View style={{ height: 20 }} />
                <View style={styles.taskbox}>
                    <View style={styles.taskInfo}>
                        <View style={styles.tasktitlebox}>
                            <Text style={styles.taskText} numberOfLines={2}>
                                {event.eventTitle}
                            </Text>
                        </View>
                        
                    </View>
                    <Text style={styles.taskstartText}>
                        イベント開始: {event.date}
                    </Text>
                </View>
            </>
        );
    };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
    
        usericon: {
            width: 40,
            height: 40,
            backgroundColor: '#eeeeee',
            marginLeft: 230,
            borderRadius: 50,
        },
    
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            padding: 10,
        },
        titleText: {
            fontSize: 24,
            fontWeight: 'bold',
        },
    
        stepContainer: {
            gap: 8,
            marginBottom: 8,
            padding: 10,
        },
        headerImage: {
            width: Dimensions.get("window").width,
            height: 100,
            backgroundColor: '#ccc',
        },
        taskText: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        taskstartText: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        add_button: {
            position: "absolute",
            bottom: "5%",
            right: "5%",
    
        },
        button_content: {
            color: "white",
            backgroundColor: 'aqua',
            fontSize: 100,
        },
        submitButton: {
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            color: "white",
            backgroundColor: 'aqua',
            width: 60,
            height: 60,
        },
        taskbox: {
            backgroundColor: '#eeeeee',
            gap: 8,
            marginBottom: 8,
            padding: 10,
            height: 115,
        },
        tasktitlebox: {
            backgroundColor: '#eeeeee',
            gap: 8,
            height: 50,
            width: 270,
        },
        taskInfo: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        importance: {
            marginLeft: 20, // 重要度とタスクの間に少し間隔をあける
        },
        tag: {
            marginLeft: 20, // 重要度とタスクの間に少し間隔をあける
        },
        importanceValue: {
            fontWeight: 'bold', // 重要度を強調する
        },
        deleteButton: {
            backgroundColor: '#DCD0FF',
            width: 100,
            height: 40,
            marginLeft: 50,
        },
        completetask: {
            fontWeight: 'bold',
            fontSize: 14,
        }
    });
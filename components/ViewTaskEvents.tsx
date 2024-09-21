import { Text, StyleSheet, Dimensions, View, Image } from 'react-native';
interface Task {
    taskTitle: string;
    date: string;
    time: string;
    notificationId: string;
    selectedPriority: string | null;
    selectedTag: string | null;
}
    export const ViewTask = ({ task }: { task: Task }) => {
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
        height: 100,
    },
    tasktitlebox: {
        backgroundColor: '#eeeeee',
        gap: 8,
        height: 60,
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

});
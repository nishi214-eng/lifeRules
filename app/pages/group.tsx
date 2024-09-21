import { useState,useEffect } from 'react';
import { auth } from '../(tabs)/firebaseConfig';  // firebase.ts から auth をインポート
import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx
import { getFriendTaskData } from '@/feature/getFirestore';
import { ViewTask } from "@/components/ViewTaskEvents";
import { ScrollView } from 'react-native';

type GroupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Group'>;

interface Props {
    navigation: GroupScreenNavigationProp;
}
interface Task {
    id: string,
    taskTitle: string;
    date: string;
    time: string;
    notificationId: string;
    selectedPriority: string | null;
    selectedTag: string | null;
}

export default function GroupScreen({ navigation }: Props) {
    const [tasks, setTasks] = useState<Task[]>([]); // タスクデータのstate
    useEffect(() => {
        const fetchTasks = async () => {
          const data = await getFriendTaskData();
          setTasks(data);
        };
        
        fetchTasks();
    }, []);
    return(
        <View >
               <View style={{ height: 20 }}></View>
                <ScrollView>
                    <View style={styles.container}>
                        {/* タスクを表示 */}
                        {tasks.map(task => (
                            <ViewTask task={task} />
                        ))}
                    </View>
                </ScrollView> 
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

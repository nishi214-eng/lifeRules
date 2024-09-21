import React, { useState } from "react";
import { Text, StyleSheet, Dimensions, View, Image, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from "react-native-calendars";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FAB, Portal, PaperProvider, Button } from 'react-native-paper';
import moment from "moment";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx
import { auth } from "@/app/(tabs)/firebaseConfig";
import { db } from "@/app/(tabs)/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { getTaskData } from "@/feature/getFirestore";
import { getEventsData } from "@/feature/getFirestore";
interface Task {
    taskTitle: string;
    date: string;
    time: string;
    notificationId: string;
    selectedPriority: string | null;
    selectedTag: string | null;
}
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const INITIAL_DATE = moment().format("YYYY-MM-DD");


export default function HomeScreen({ navigation }: Props) {

    const [selected, setSelected] = useState(INITIAL_DATE);
    const [state, setState] = React.useState({ open: false });

    const handleDayPress = (day: any) => {
        setSelected(day.dateString);
    }

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });
    const { open } = state;

    const handlePress = () => {
        // 画面遷移など
        navigation.navigate('Profile'); // 例: Profile画面に遷移
    };

    const deleteTask = () => {

    }

    const [tasks, setTasks] = useState<Task[]>([]); // タスクデータのstate
    useEffect(() => {
        const fetchTasks = async () => {
          const data = await getTaskData();
          setTasks(data);
        };
        
        fetchTasks();
    }, []);

    const [events, setEvents] = useState<Task[]>([]); // eventデータのstate
    useEffect(() => {
        const fetchEvents = async () => {
          const data = await getEventsData();
          setEvents(data);
        };
        
        fetchEvents();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>LifeRules</Text>
                <TouchableOpacity onPress={handlePress}>
                    <Image style={styles.usericon}
                        source={require('@/assets/images/partial-react-logo.png')}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 3 }}>
                <Calendar
                    style={{
                        height: 300
                    }}

                    monthFormat={"yyyy年 MM月"}
                    current={INITIAL_DATE}
                    markedDates={{
                        [selected]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: 'pink',
                            selectedTextColor: 'white'
                        }
                    }}
                    onDayPress={handleDayPress}
                />

            </View>
            <View style={{ height: 20 }}></View>
            <View style={styles.taskbox}>
                <View style={styles.taskInfo}>
                    <View style={styles.tasktitlebox}>
                        <Text style={styles.taskText} numberOfLines={2}>aiueokakikukekosashisusesotachitsuteto</Text>
                    </View>
                    <View style={styles.importance}>
                        <Text style={styles.importanceValue}>重要度: 5</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text >家事</Text>
                    </View>
                </View>
                <View style={styles.taskInfo}>
                    <Text style={styles.taskstartText}>タスク開始: 2024年9月21日 22:30~</Text>
                    <Button onPress={deleteTask} style={styles.deleteButton}>
                        <Text style={styles.completetask}>タスク完了</Text>
                    </Button>
                </View>
            </View>
            <PaperProvider>
                <Portal>
                    <FAB.Group
                        open={open}
                        visible
                        icon={open ? 'plus' : 'plus'}
                        actions={[
                            {
                                icon: 'note',
                                label: 'タスクを追加',
                                onPress: () => navigation.navigate('Task')
                            },
                            {
                                icon: 'calendar-today',
                                label: 'イベントを追加',
                                onPress: () => navigation.navigate('Event')
                            },
                        ]}
                        onStateChange={onStateChange}
                        onPress={() => {
                            if (open) {
                                // do something if the speed dial is open
                            }
                        }}
                    />
                </Portal>
            </PaperProvider>
        </View>
    );
}

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

LocaleConfig.locales.jp = {
    today: "今日",
    monthNames: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月",],
    monthNamesShort: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月",],
    dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日",],
    dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
};
LocaleConfig.defaultLocale = "jp";

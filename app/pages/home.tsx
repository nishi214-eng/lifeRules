import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Dimensions, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from "react-native-calendars";
import { FAB, Portal, Provider as PaperProvider } from 'react-native-paper';
import moment from "moment";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx
import { getTaskData } from "@/feature/getFirestore";
import { getEventsData } from "@/feature/getFirestore";
import { ViewTask } from "@/components/ViewTaskEvents";
import { ViewEvent } from "@/components/ViewTaskEvents";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const INITIAL_DATE = moment().format("YYYY-MM-DD");

export default function HomeScreen({ navigation }: Props) {
    const [selected, setSelected] = useState(INITIAL_DATE);
    const [state, setState] = useState({ open: false });
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await getTaskData();
            setTasks(data);
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEventsData();
            setEvents(data);
        };

        fetchEvents();
    }, []);

    const handleDayPress = (day: any) => {
        setSelected(day.dateString);
    }

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });
    const { open } = state;

    return (
        <PaperProvider>
            <View style={styles.container}>
                {/* ヘッダー */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>LifeRules</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image style={styles.usericon} source={require('@/assets/images/react-logo.png')} />
                    </TouchableOpacity>
                </View>

                {/* カレンダー */}
                <Calendar
                    style={{ height: 300 }}
                    monthFormat={"yyyy年 MM月"}
                    current={INITIAL_DATE}
                    markedDates={{ [selected]: { selected: true, disableTouchEvent: true, selectedColor: 'pink', selectedTextColor: 'white' }}}
                    onDayPress={handleDayPress}
                />

                <ScrollView>
                    <View style={styles.container}>
                        {/* タスクを表示 */}
                        {tasks.map(task => <ViewTask key={task.id} task={task} />)}
                        {/* イベントを表示 */}
                        {events.map(event => <ViewEvent key={event.id} event={event} />)}
                    </View>
                </ScrollView>

                <Portal>
                    {/* 背景の曇りを追加 */}
                    {open && <View style={styles.overlay} />}
                    <FAB.Group
                        open={open}
                        icon={open ? 'plus' : 'plus'}
                        actions={[
                            { icon: 'note', label: 'タスクを追加', onPress: () => navigation.navigate('Task') },
                            { icon: 'calendar-today', label: 'イベントを追加', onPress: () => navigation.navigate('Event') },
                        ]}
                        onStateChange={onStateChange}
                        style={styles.fab} // ここでスタイルを適用
                    />
                </Portal>
            </View>
        </PaperProvider>
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
        marginRight: 25,
        borderRadius: 50,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6,
        padding: 10,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    fab: {
			  zIndex: 2, // FABのzIndexを設定
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // 曇りの色と透明度
        zIndex: 1, // オーバーレイのzIndex
    },
});

// カレンダーのロケール設定
LocaleConfig.locales.jp = {
    today: "今日",
    monthNames: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月",],
    monthNamesShort: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月",],
    dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日",],
    dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
};
LocaleConfig.defaultLocale = "jp";

import React, { useState } from "react";
import { Text, StyleSheet, Dimensions, View, Image } from 'react-native';
import { Calendar, LocaleConfig } from "react-native-calendars";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FAB, Portal, PaperProvider, Button } from 'react-native-paper';
import moment from "moment";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

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

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>LifeRules</Text>
                <Image style={styles.usericon}
                />
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
                <Text style={styles.taskstartText}>タスク開始: 2024年9月21日 22:30~</Text>
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
        padding: 3,
        width: 50,
        height: 50,
        position: 'absolute',
        backgroundColor: '#eeeeee',
        marginLeft: 340,
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

LocaleConfig.locales.jp = {
    today: "今日",
    monthNames: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月",],
    monthNamesShort: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月",],
    dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日",],
    dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
};
LocaleConfig.defaultLocale = "jp";

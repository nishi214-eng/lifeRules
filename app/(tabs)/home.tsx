import React, { useState } from "react";
import { Text, StyleSheet, Dimensions, View, Image } from 'react-native';
import { Calendar, LocaleConfig } from "react-native-calendars";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
const INITIAL_DATE = moment().format("YYYY-MM-DD");

export default function HomeScreen() {
    const [selected, setSelected] = useState(INITIAL_DATE);
    const handleDayPress = (day: any) => {
        setSelected(day.dateString);
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.headerImage}
            />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>LifeRules</Text>
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
            <View style={styles.stepContainer}>
                <Text style={styles.taskText}>{moment(selected).format("MM月DD日")} のタスク</Text>
            </View>
            <View style={styles.add_button}>
                <FontAwesomeIcon style={styles.button_content} size={50} icon={faPlus} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    add_button: {
        position: "absolute",
        bottom: "5%",
        right: "5%",

    },
    button_content: {
        color: "white",
        backgroundColor: 'aqua',
        fontSize: 1000,
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

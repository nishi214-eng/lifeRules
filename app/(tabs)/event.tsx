import React, { useState } from 'react';
import { View, StyleSheet, Text, Appearance  } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import { requestOpenAi } from '@/feature/requestOpenAi';
import { schedulePushNotification } from '../notifications';

interface Props {
  navigation: {
    goBack: () => void;
  };
}

export default function eventHandle({ navigation }: Props) {
  const [eventTitle, setEventTitle] = useState<string>('');
  //const [textBox2, setTextBox2] = useState<string>('');
  //const [textBox3, setTextBox3] = useState<string>('');
  //const [textBox4, setTextBox4] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime) {
      setTime(selectedTime);
    }
    setShowTimePicker(false);
  };

  const handleDatePress = () => {
    if (showDatePicker) {
      // If it's already showing, hide it
      setShowDatePicker(false);
    } else {
      // Show the date picker
      setShowDatePicker(true);
    }
  }
  const handleTimePress = () => {
    if (showTimePicker) {
      // If it's already showing, hide it
      setShowTimePicker(false);
    } else {
      // Show the date picker
      setShowTimePicker(true);
    }
  }
  //for reading, not used now.
  const readData = async () => {
    const path = `${FileSystem.documentDirectory}taskData.json`;
    
    try {
      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(path);
      
      if (fileInfo.exists) {
        // Read the file content
        const fileContents = await FileSystem.readAsStringAsync(path);
        // Parse the JSON content
        const parsedData = JSON.parse(fileContents);
        
        console.log('Read data:', parsedData);
        return parsedData; // Return or use the data as needed
      } else {
        console.log('File does not exist');
      }
    } catch (error) {
      console.error('Failed to read data:', error);
    }
  };

  const handleSubmit = async () => {
    const systemPrompt = "あなたはイベントスケジューラーです。重要度が高いタスクに対する通知文を短文で生成してください";
    let userPrompt = `イベント「${eventTitle}」を通知する通知文を生成してください`;
    try {

      const generateText = await requestOpenAi(systemPrompt, userPrompt); // awaitを使用
      const generateTextToStr = String(generateText); // 生成文をstringに変換
      const combinedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()); // 予定の時刻をセット
      const notificationId = await schedulePushNotification(eventTitle, generateTextToStr, combinedDate); // 通知を作成

      const eventData = {
        eventTitle,
        date: date.toISOString(),
        time: time.toISOString(),
        notificationId
      };
      const path = `${FileSystem.documentDirectory}taskData.json`;
      try {
        await FileSystem.writeAsStringAsync(path, JSON.stringify(eventData, null, 2));
        console.log('Data saved to', path);
      } catch (error) {
        console.error('Failed to save data:', error);
      }
      console.log('Task Data:', eventData);
    }catch (error) {
      console.error("Error generating text:", error); // エラーハンドリング
  }
};

  return (
    <View style={styles.container}>
      <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton}>
        Back
      </Button>
      {/* title */}
      <View style={styles.txtContainer}>
      <Text style={styles.txtLabel}>タスクのタイトル:</Text>
        <TextInput
          placeholder="ここに入力してください"
          mode="outlined"
          value={eventTitle}
          onChangeText={setEventTitle}
          style={styles.textBox}
        />
      </View>

      {/* date */}      
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date:</Text>
        <Button mode="outlined" onPress={handleDatePress} style={styles.dateButton}>
          {date.toDateString()}
        </Button>
        {showDatePicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        </View>
        )}
      </View>

      {/* time */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Time:</Text>
        <Button mode="outlined" onPress={handleTimePress} style={styles.dateButton}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Button>
        {showTimePicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        </View>
        )}
      </View>

      {/* note */}
      <View style={styles.txtContainer}>
      <Text style={styles.txtLabel}>タスクのタイトル:</Text>
        <TextInput
          placeholder="ここに入力してください"
          mode="outlined"
          value={note}
          onChangeText={setNote}
          style={styles.textBox}
        />
      </View>
      <View style={styles.submitContainer}>
        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          Submit
        </Button>
      </View>
      
    </View>
  );
}

const colorScheme = Appearance.getColorScheme();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 20,
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF', // Adjust background color
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  txtContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  txtLabel:{
    marginRight: 10,
    fontSize: 16,
    lineHeight: 40,
    width: 200,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust text color
  },
  textBox: {
    marginBottom: 10,
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateLabel: {
    marginRight: 10,
    fontSize: 16,
    lineHeight: 40,
    width: 50,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust text color
  },
  dateButton: {
    flex: 1,
  },
  pickerContainer: {
    alignItems: 'center',
  },
  dropContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  selectLabel: {
    marginRight: 10,
    fontSize: 18,
    lineHeight: 40,
    width: 200,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust text color
  },
  dropdownButtonStyle: {
    width: 100,
    height: 50,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#E9ECEF', // Adjust background color
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust text color
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust arrow color
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust icon color
  },
  dropdownMenuStyle: {
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#E9ECEF', // Adjust background color
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust text color
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust icon color
  },
  submitContainer:{
    flex:1,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  submitButton: {
    alignItems: 'center',
    marginTop: 20,
  },
});
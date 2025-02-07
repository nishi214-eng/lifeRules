import React, { useState } from 'react';
import { View, StyleSheet, Text, Appearance } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import * as FileSystem from 'expo-file-system';
import { schedulePushNotification } from '../notifications';
import { requestOpenAi } from '@/feature/requestOpenAi';
import { addTask } from '@/feature/uploadFirestore';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

type TaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Task'>;

interface Props {
  navigation: TaskScreenNavigationProp;
}

export default function TimeHandle({ navigation }: Props) {
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  type DropdownItem = {
    key: string;
    value: string;
  };
  const priority = [
    { title: '低' },
    { title: '中' },
    { title: '高' },
  ];
  const tag = [
    { title: '会社' },
    { title: '家事' },
    { title: '子育て' },
    { title: 'パート・アルバイト' },
    { title: '学校' },
    { title: 'その他' },
  ];

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

  const handleSubmit = async () => {
    const systemPrompt = `あなたはタスクスケジューラーです。重要度が高ければ厳しく(語調が荒く、怒り狂った関西人のように)。「低」ならば優しく通知します（柔らかい口調で。お姉さんのように）。タスクに対する通知文を短文で生成してください`;
    let userPrompt = `タスク「${taskTitle}」を通知する通知文を生成してください。タスクの重要度は「${selectedPriority}」です。`;
    const path = `${FileSystem.documentDirectory}taskData.json`;
    try {
      const generateText = await requestOpenAi(systemPrompt, userPrompt); // awaitを使用
      const generateTextToStr = String(generateText); // 生成文をstringに変換
      const combinedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()); // 予定の時刻をセット
      const notificationId = await schedulePushNotification(taskTitle, generateTextToStr, combinedDate); // 通知を作成
      let notId = String(notificationId);
      const taskData = {
        taskTitle,
        selectedPriority,
        date: date.toISOString(),
        time: time.toISOString(),
        selectedTag,
        notId
      };
      try {
        if (notId) {
          await addTask(
            taskData.taskTitle,
            taskData.date,
            taskData.time,
            notId,
            taskData.selectedPriority,
            taskData.selectedTag,
          );
          await FileSystem.writeAsStringAsync(path, JSON.stringify(taskData, null, 2));
          console.log('Data saved to', path);
          
        }
      } catch (error) {
        console.error('Failed to save data:', error);
      }

      console.log('Task Data:', taskData);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error generating text:", error); // エラーハンドリング
    }
  };

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


  return (
    <View style={styles.container}>
      {/* title */}
      <View style={styles.txtContainer}>
        <Text style={styles.txtLabel}>タイトル:</Text>
        <TextInput
          placeholder="ここに入力してください"
          mode="outlined"
          value={taskTitle}
          onChangeText={setTaskTitle}
          style={styles.textBox}
        />
      </View>

      {/* importance */}
      <View style={styles.dropContainer}>
        <Text style={styles.selectLabel}>
          重要度:
        </Text>
        <SelectDropdown
          data={priority}
          onSelect={(selectedItem, index) => {
            setSelectedPriority(selectedItem.title);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>

                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Select'}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>
      {/* date */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>日付:</Text>
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
        <Text style={styles.dateLabel}>時間:</Text>
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

      {/* tag */}
      <View style={styles.dropContainer}>
        <Text style={styles.selectLabel}>
          タグ:
        </Text>
        <SelectDropdown
          data={tag}
          onSelect={(selectedItem, index) => {
            setSelectedTag(selectedItem.title);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>

                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Select'}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>

      <View style={styles.submitContainer}>
        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          登録
        </Button>
      </View>
    </View>
  );
}

const colorScheme = Appearance.getColorScheme();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF', // Adjust background color
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  txtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  txtLabel: {
		marginBottom: 8,
    marginRight: 18,
    fontSize: 18,
    lineHeight: 40,
    width: 100,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust text color
  },
  textBox: {
		width: '100%',
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
		marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  selectLabel: {
		flex: 1,
    fontSize: 18,
    width: 100,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000', // Adjust text color
  },
  dropdownButtonStyle: {
    width: 200,
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
  submitContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  submitButton: {
    alignItems: 'center',
    marginBottom: '5%',
  },
});
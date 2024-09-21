import React, { useState } from 'react';
import { View, StyleSheet, Text, Appearance  } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import * as FileSystem from 'expo-file-system';
import { schedulePushNotification } from '../notifications';
import { requestOpenAi } from '@/feature/requestOpenAi';

interface Props {
  navigation: {
    goBack: () => void;
  };
}

export default function timeHandle({ navigation }: Props) {
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
    {title:'a'},
    {title:'b'},
    {title:'c'},
  ];
  const tag = [
    {title:'aa'},
    {title:'bb'},
    {title:'cc'},
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
    const systemPrompt = "あなたはタスクスケジューラーです。重要度が高いタスクに対する通知文を短文で生成してください";
    let userPrompt = `タスク「${taskTitle}」を通知する通知文を生成してください`;
    const path = `${FileSystem.documentDirectory}taskData.json`;
    try {
        const generateText = await requestOpenAi(systemPrompt, userPrompt); // awaitを使用
        const generateTextToStr = String(generateText); // 生成文をstringに変換
        const combinedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()); // 予定の時刻をセット
        const notificationId = await schedulePushNotification(taskTitle, generateTextToStr, combinedDate); // 通知を作成
        const taskData = {
          taskTitle,
          selectedPriority,
          date: date.toISOString(),
          time: time.toISOString(),
          selectedTag,
          notificationId
        };
        
        try {
            await FileSystem.writeAsStringAsync(path, JSON.stringify(taskData, null, 2));
            console.log('Data saved to', path);
        } catch (error) {
            console.error('Failed to save data:', error);
        }
        
        console.log('Task Data:', taskData);
    } catch (error) {
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
          value={taskTitle}
          onChangeText={setTaskTitle}
          style={styles.textBox}
        />
      </View>
      
      {/* importance */}
      <View style={styles.dropContainer}>
        <Text style={styles.selectLabel}>
          重要度
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
              <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
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

      {/* tag */}
      <View style={styles.dropContainer}>
        <Text style={styles.selectLabel}>
        タスクのタグ
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
              <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
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
    flex:1,
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
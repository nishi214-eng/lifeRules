import React, { useState } from 'react';
import { View, StyleSheet, Text, Appearance } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import { requestOpenAi } from '@/feature/requestOpenAi';
import { schedulePushNotification } from '../notifications';
import { addEvent } from '@/feature/uploadFirestore';

//
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';

type EventScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Event'>;

interface Props {
  navigation: EventScreenNavigationProp;
}

export default function EventHandle({ navigation }: Props) {
  const [eventTitle, setEventTitle] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>(''); // State for AI response

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
    setShowDatePicker(!showDatePicker);
  };

  const handleTimePress = () => {
    setShowTimePicker(!showTimePicker);
  };

  const handleSubmit = async () => {
    const systemPrompt = "あなたはイベントスケジューラーです。重要度が高いタスクに対する通知文を短文で生成してください";
    let userPrompt = `イベント「${eventTitle}」を通知する通知文を生成してください`;
    
    try {
      const generateText = await requestOpenAi(systemPrompt, userPrompt);
      const generateTextToStr = String(generateText);
      const combinedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
      const notificationId = await schedulePushNotification(eventTitle, generateTextToStr, combinedDate);

      const path = `${FileSystem.documentDirectory}taskData.json`;
      let notId = String(notificationId);
      const eventData = {
        eventTitle,
        date: date.toISOString(),
        time: time.toISOString(),
        notificationId
      };
      try {
        alert("test");
        if (notId) {
          await addEvent(
            eventData.eventTitle,
            eventData.date,
            eventData.time,
            notId,
          );
          await FileSystem.writeAsStringAsync(path, JSON.stringify(eventData, null, 2));
          console.log('Data saved to', path);
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('Failed to save data:', error);
      }
      console.log('Task Data:', eventData);
    } catch (error) {
      console.error("Error generating text:", error); // エラーハンドリング
    }
  };


  const getCurrentISOTime = () => {
    const currentTime = new Date();
    return currentTime.toISOString();
    
  };
  
  
  

  const handleGenerateTodoList = async () => {
    console.log('Data saved to', getCurrentISOTime());
    const userPrompt = `今は${getCurrentISOTime()}です．${date}，${time}にあるイベント「${eventTitle}」に基づいて、タスクのリストを生成してください。各タスクは以下の形式で出力してください：\n\nタスクのタイトル\nYYYY-MM-DD\nHH:MM\n高、中、低\n\n追加の文字，説明やアドバイスは不要です。タスクのタイトルの前には追加の文字（」「タスクのタイトル」のような文字列）は不要です．タイトルは日本語で出す`;

    try {
      const response = await requestOpenAi("あなたはタスク管理者です。", userPrompt);
      const generatedResponse = String(response);
  
      // Parse AI response into tasks array
      const tasks = parseAiResponse(generatedResponse);
  
      // Log the tasks array to ensure correct structure
      console.log('Parsed tasks:', tasks);
  
      navigation.navigate('AiTask', { tasks });
    } catch (error) {
      console.error("Error generating to-do list:", error);
    }
  };
  type Task = {
    aitask: string;
    deadlineDate: string; // ISO format
    deadlineTime: string; // HH:mm format
    aipriority: string;
  };


  
  
  const parseAiResponse = (response: string): Task[] => {
    const taskBlocks = response.split('\n\n');
    console.log("Task Blocks:", taskBlocks); // Log the task blocks
  
    const tasks: Task[] = taskBlocks.map((taskBlock) => {
      console.log("Task Block:", taskBlock); // Log each task block
  
      const lines = taskBlock.split('\n');
      if (lines.length >= 4) {
        return {
          aitask: lines[0]?.replace('タスク名: ', '').trim() || "No task provided",
          deadlineDate: lines[1]?.trim() || "No date provided",
          deadlineTime: lines[2]?.trim() || "No time provided",
          aipriority: lines[3]?.trim() || "No priority provided",
        };
      }
      return {
        aitask: "No task provided",
        deadlineDate: "No date provided",
        deadlineTime: "No time provided",
        aipriority: "No priority provided",
      };
    });
  
    return tasks.filter(task => task.aitask !== "No task provided");
  };
  
  
  
  
  {/*)
  // Adjust the parse function to handle multiple tasks
  const parseAiResponse = (response: string) => {
    const tasks = response.split('\n\n').map(taskBlock => {
      const lines = taskBlock.split('\n');
      
      // Check if lines exist before accessing array elements
      return {
        aitask: lines[0] || "No task provided",  // Default text in case of missing info
        deadlineDate: lines[1] || "No date provided", 
        deadlineTime: lines[2] || "No time provided", 
        aipriority: lines[3] || "No priority provided",
      };
    });
  
    return tasks;
  };*/}
  

  return (
    <View style={styles.container}>
      <Button mode="text" onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        Back
      </Button>

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

      {/* Date and Time Pickers */}
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

      {/* Note Input */}
      <View style={styles.txtContainer}>
        <Text style={styles.txtLabel}>ノート:</Text>
        <TextInput
          placeholder="ここに入力してください"
          mode="outlined"
          value={note}
          onChangeText={setNote}
          style={styles.textBox}
        />
      </View>

      {/* Button to Generate To-Do List */}
      <View style={styles.submitContainer}>
        <Button mode="contained" onPress={handleGenerateTodoList} style={styles.submitButton}>
          Generate To-Do List
        </Button>
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
  txtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  txtLabel: {
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
  submitContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  submitButton: {
    alignItems: 'center',
    marginTop: 20,
  },
});
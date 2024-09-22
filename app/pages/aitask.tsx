import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../index';
import Checkbox from 'expo-checkbox';
import * as FileSystem from 'expo-file-system';
import { schedulePushNotification } from '../notifications';
import { addTask } from '@/feature/uploadFirestore';
import { aiAddTask } from '@/feature/uploadFirestore';

type AiTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AiTask'>;
type AiTaskScreenRouteProp = RouteProp<RootStackParamList, 'AiTask'>;

interface Props {
  navigation: AiTaskScreenNavigationProp;
  route: AiTaskScreenRouteProp;
}



export default function AiTask({ route, navigation }: Props) {
  const { tasks } = route.params;
//  console.log('Parsed tasks:', tasks);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(Array(tasks.length).fill(false));

  const toggleCheckbox = (index: number) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  
  const saveCheckedTasks = async () => {
    const checkedTasks = tasks.filter((_, index) => checkedItems[index]);
  
    // Convert dates and times to ISO format
    const formattedTasks = checkedTasks.map(async task => {
      const [year, month, day] = task.deadlineDate.split('-');
      const [hours, minutes] = task.deadlineTime.split(':');
      
      // Create a new Date object with UTC
      const deadline = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes)));
      const notificationId = await schedulePushNotification(task.aipriority,task.aitask,deadline);
      let notId = String(notificationId);
      // addTask
      await aiAddTask(
        task.aitask,
        task.deadlineDate,
        task.deadlineTime,
        notId
      )
      return {
        ...task,
        deadlineDate: deadline.toISOString(), // Full date in ISO format
        deadlineTime: deadline.toISOString()//.split('T')[1] // Just the time part in ISO format
      };
    });
  
    // Log the formatted tasks to verify the output
    console.log('Formatted Tasks:', formattedTasks);
  
    const json = JSON.stringify(formattedTasks, null, 2); // Convert to JSON with formatting
    console.log('Saved JSON:', json);
  
    try {
      
      const fileUri = `${FileSystem.documentDirectory}aiTasks.json`; // *******PATH!!!*********
      await FileSystem.writeAsStringAsync(fileUri, json);
      alert('Checked tasks saved successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save checked tasks.');
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Generated To-Do List:</Text>

      {tasks.map((task, index) => (
        <View key={index} style={styles.taskContainer}>
          
          <View style={styles.taskDetails}>
            <Text style={styles.label}>Task {index + 1}:</Text>
            <Text>{task.aitask}</Text>
            <Text style={styles.label}>Deadline Date:</Text>
            <Text>{task.deadlineDate}</Text>
            <Text style={styles.label}>Deadline Time:</Text>
            <Text>{task.deadlineTime}</Text>
            <Text style={styles.label}>Priority:</Text>
            <Text>{task.aipriority}</Text>
          </View>
          <Checkbox style={styles.check}
            value={checkedItems[index]}
            onValueChange={() => toggleCheckbox(index)}
          />
        </View>
      ))}
      <Button title="Confirm" onPress={saveCheckedTasks} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space between children
    alignItems: 'center', // Center items vertically
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  check:{
    marginRight: 30 ,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  taskDetails:{
    marginLeft: 10,
  },
});

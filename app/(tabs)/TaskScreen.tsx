import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './index'; // Import the type

type TaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Task'>;

interface Props {
  navigation: TaskScreenNavigationProp;
}

const TaskScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Task Screen</Text>
      <Button title="Submit Task" onPress={() => navigation.navigate('Home')} />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskScreen;

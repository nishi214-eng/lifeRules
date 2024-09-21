import { useState } from 'react';
import { auth } from '../(tabs)/firebaseConfig';  // firebase.ts から auth をインポート
import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

type GroupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Group'>;

interface Props {
    navigation: GroupScreenNavigationProp;
}

export default function GroupScreen({ navigation }: Props) {
    return(
        <View >
                
        </View>
    );
}
import { useState } from 'react';
import { auth } from '../(tabs)/firebaseConfig';  // firebase.ts から auth をインポート
import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

type ProfileeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
    navigation: ProfileeScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    profile: {
        flex: 1,
        alignItems: 'center',
        marginTop: 300,
        marginLeft: "35%",
        justifyContent: 'space-around',
    },
    profileimage: {
        width: 100,
        height: 100,
        borderColor: 'red',
        borderRadius: 30,
    }
});
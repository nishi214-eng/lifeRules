import { useState } from 'react';
import { auth } from "@/app/(tabs)/firebaseConfig";
import { db } from "@/app/(tabs)/firebaseConfig";
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';

import { getAuth, getIdTokenResult } from 'firebase/auth';


import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

type ProfileeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
    navigation: ProfileeScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);

    const uid = auth.currentUser?.uid;
    if (!uid) {
        console.error('User is not authenticated');
        return;
    }
    const userDocRef = doc(db, 'users', uid);
    getDoc(userDocRef)
        .then((doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                console.log('User data:', userData);
            } else {
                console.log('No such document!');
            }
        })
        .catch((error) => {
            console.error('Error getting document: ', error);
        });


    const handleLogin = () => {
        // Firebase Authenticationを使ってユーザーをログイン
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // ログイン成功時の処理
                const user = userCredential.user;
                console.log('User logged in:', user);
                setUser(user); // ログイン成功時にユーザー情報を保存
                setErrorMessage(null); // エラーメッセージをクリア
                navigation.navigate('Home');
            })
            .catch((error) => {
                // エラー処理
                setErrorMessage(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Image style={styles.usericon}
                source={require('@/assets/images/partial-react-logo.png')}
            />
            <View style={{ height: 20 }}></View>
            <Text>{uid}</Text>
            {user ? (
                <Text>{user.email} でログインしています</Text>
            ) : (
                <>
                    <TextInput
                        placeholder="メールアドレス"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="パスワード"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                </>
            )}

            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        marginTop: 100,
        width: 100,
        height: 100,
        borderColor: 'red',
        borderRadius: 30,
    },
    usericon: {
        marginTop: 50,
        width: 150,
        height: 150,
        backgroundColor: '#eeeeee',
        marginLeft: "30%",
        borderRadius: 100,
    },
});
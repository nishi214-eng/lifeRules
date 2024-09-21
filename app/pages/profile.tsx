import { useState, useEffect } from 'react';
import { auth } from '../(tabs)/firebaseConfig';  // firebase.ts から auth をインポート
import { onAuthStateChanged } from 'firebase/auth';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

type ProfileeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
    navigation: ProfileeScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
    const [user, setUser] = useState<any | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

		useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); // ユーザーがログインしている場合、ユーザー情報を保存
                setErrorMessage(null); // エラーメッセージをクリア
            } else {
                setUser(null); // ユーザーがログアウトしている場合
            }
        });

        return () => unsubscribe(); // クリーンアップ
    }, []);

    return (
        <View style={styles.container}>
            {user ? (
                <View style={styles.profile}>
                    <Image
//                       style={styles.usericon}
                      source={require('@/assets/images/react-logo.png')}
                    />
                    <Text>{user.email} でログインしています</Text>
                    {/* <Image source={{ uri: user.photoURL }} style={styles.profileimage} /> */}
                </View>
            ) : (
                <Text>ログインしていません</Text>
            )}
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    profile: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    profileimage: {
        width: 100,
        height: 100,
        borderColor: 'red',
        borderRadius: 30,
    }
});
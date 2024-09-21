import { useState, useEffect } from 'react';
import { auth } from '../(tabs)/firebaseConfig';  // firebase.ts から auth をインポート
import { onAuthStateChanged, signOut } from 'firebase/auth'; // signOutをインポート
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
    navigation: ProfileScreenNavigationProp;
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

        const focusListener = navigation.addListener('focus', () => {
            // 必要に応じてデータを再取得したり、表示を更新したりする処理を追加
            setErrorMessage(null); // エラーメッセージをクリア
        });

        return () => {
            unsubscribe(); // クリーンアップ
            focusListener(); // フォーカスリスナーのクリーンアップ
        };
    }, [navigation]);

    const handleLogout = async () => {
        try {
					await signOut(auth); // Firebaseからログアウト
          navigation.navigate('Login'); // ログイン画面に遷移
        } catch (error) {
            setErrorMessage(error.message); // エラーメッセージを表示
        }
    };

    return (
        <View style={styles.container}>
            {user ? (
                <View style={styles.profile}>
                    <Image
                        source={require('@/assets/images/react-logo.png')}
                    />
                    <Text>{user.email} でログインしています</Text>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={{ color: 'white' }}>ログアウト</Text>
                    </TouchableOpacity>
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
    button: {
        height: 50,  // ボタンの高さも50に
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007BFF',  // ボタンの背景色
        borderRadius: 5,
        marginTop: 20, // ボタンの上にスペースを追加
        width: '100%', // 幅を画面全体に
    },
});
import { useState } from 'react';
import { auth } from '../(tabs)/firebaseConfig';  // firebase.ts から auth をインポート
import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

//
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}


export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

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
          <Button title="ログイン" onPress={handleLogin} />
        </>
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
});
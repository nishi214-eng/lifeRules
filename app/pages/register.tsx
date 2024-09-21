import { useState } from 'react';
import { auth } from '../(tabs)/firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../index';  // Import types from index.tsx

export default function Register({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = () => {
     // Firebase Authenticationを使ってユーザーを作成
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('User created:', user);
            setErrorMessage(null);  // エラーメッセージをクリア
            navigation.navigate('Login');
          })
          .catch((error) => {
            setErrorMessage(error.message);  // エラーメッセージを表示
          });
  };

  return (
    <View style={styles.container}>
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
      <Button title="登録" onPress={handleSignUp} />

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
		height: 50,  // 高さを50にして大きめに
    width: '100%',  // 幅を画面全体に
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 16,  // 文字サイズを調整
  },
	button: {
    height: 50,  // ボタンの高さも50に
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007BFF',  // ボタンの背景色（お好みで変更可能）
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
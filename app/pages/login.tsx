import styled from 'styled-components/native';
import { useState } from 'react';
import { auth } from '../(tabs)/firebaseConfig';  // firebase.ts から auth をインポート
import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
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

  const handleRegister = () => {
    navigation.navigate('Register');
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User logged in:', user);
        setUser(user); // ログイン成功時にユーザー情報を保存
        setEmail(''); // ログイン成功後にリセット
        setPassword(''); // ログイン成功後にリセット
        setErrorMessage(null); // エラーメッセージをクリア
        navigation.navigate('Home');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* lifeRules アプリタイトルを追加 */}
      <Text style={styles.title}>lifeRules</Text>
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
      <Button
        title="ログイン"
        onPress={handleLogin}
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      {/* ログインボタンと登録ボタンの間に5%のスペースを追加 */}
      <View style={styles.spaceBetween} />
      <View style={styles.registerContainer}>
        <RegisterButton onPress={handleRegister}>
          <RegisterButtonText>アカウント登録はこちら</RegisterButtonText>
        </RegisterButton>
      </View>
    </View>
  );
}

const RegisterButton = styled.TouchableOpacity`
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const RegisterButtonText = styled.Text`
  text-align: center;
  color: #007BFF;
  font-size: 15px;
`;

const styles = StyleSheet.create({
  container: {
		backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 60,  // タイトルのフォントサイズ
    fontWeight: 'bold',  // タイトルを太字に
    textAlign: 'center',  // タイトルを中央に配置
    marginBottom: 20,  // 入力フォームまでの余白
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  registerContainer: {
    alignItems: 'center', 
  },
  spaceBetween: {
    height: '5%', // ログインボタンと登録ボタンの間に画面の5%分の高さのスペースを追加
  },
});
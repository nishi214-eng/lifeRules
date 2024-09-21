import { useState } from 'react';
import { auth } from './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { addDoc,collection } from 'firebase/firestore';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = () => {
     // Firebase Authenticationを使ってユーザーを作成
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            const docRef = addDoc(collection(db, 'users', user.uid, 'name'), {
              userName:userName
            });
            console.log('User created:', user);
            setErrorMessage(null);  // エラーメッセージをクリア
          })
          .catch((error) => {
            setErrorMessage(error.message);  // エラーメッセージを表示
          });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="ユーザーネーム"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
      />
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
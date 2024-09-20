import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FirebaseAuth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const auth = FirebaseAuth();

const firebaseConfig = {
  apiKey: 'AIzaSyBVZzeLV95ImDblg2e4geFZc1cXtbH59_Y',
  projectId: 'liferules-1bb5b',
  messagingSenderId: '694929948598',
  appId: '1:694929948598:android:0371239987c39dbcc78b17',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Google サインインに必須
GoogleSignin.configure({
  // 自身の Web Client ID に置き換える
  webClientId: '694929948598-v749dkvfk9rfn9naq6a911abrmqngikd.apps.googleusercontent.com',
});

export default function login() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser) {
        setEmail(auth.currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    // Google のログイン画面を表示して認証用の ID トークンを取得する
    const user = await GoogleSignin.signIn();
    const idToken = user.idToken;

    if (idToken === null) {
      return;
    }

    // 取得した認証情報 (ID トークン) を元にサインインする
    const credential = FirebaseAuth.GoogleAuthProvider.credential(idToken);
    await auth.signInWithCredential(credential);
  };

  const signOut = async () => {
    auth.signOut().then(() => setEmail(null));
  };

  return email ? (
    <View style={styles.container}>
      <Text style={styles.text}>
        {`${email} でサインインしています`}
      </Text>
      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>
          サインアウト
        </Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>
          Google でサインイン
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({ /* styles */ });
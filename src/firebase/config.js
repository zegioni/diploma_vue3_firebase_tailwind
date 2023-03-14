//Import the required methods
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//The config we copied from firebase(Replace with your config)
const firebaseConfig = {
  apiKey: 'AIzaSyBhVy7TBpxTlPviuDM6VokEOnD0XXeuuvM',
  authDomain: 'fir-auth-e4211.firebaseapp.com',
  projectId: 'fir-auth-e4211',
  storageBucket: 'fir-auth-e4211.appspot.com',
  messagingSenderId: '161274562403',
  appId: '1:161274562403:web:d58b4475c904c92d493556',
};

//initialize the firebase app
export const firebaseApp = initializeApp(firebaseConfig);
//initialize the firebase firestore db
const db = getFirestore(firebaseApp);
//initialize firebase auth
const auth = getAuth();

export { auth, db, firebaseConfig };

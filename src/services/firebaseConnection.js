
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyAJh_Ph_WDS93hsDCn9nnxsbLdzoMcL0MQ",
    authDomain: "tickets-fbd30.firebaseapp.com",
    projectId: "tickets-fbd30",
    storageBucket: "tickets-fbd30.appspot.com",
    messagingSenderId: "61731233954",
    appId: "1:61731233954:web:03c166cb2ecab8da09b7fb",
    measurementId: "G-CS5VCGC7TN"
  };


const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage }
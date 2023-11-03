// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore}  from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtL304UB9UKo6R1A8kvAK8ibxNSbO4h9A",
  authDomain: "location-app-97595.firebaseapp.com",
  projectId: "location-app-97595",
  storageBucket: "location-app-97595.appspot.com",
  messagingSenderId: "1011241794700",
  appId: "1:1011241794700:web:ce284780d3a3b34e100fa9"
};

// Initialize Firebase
const dbApp = initializeApp(firebaseConfig);
export const db = getFirestore(dbApp);
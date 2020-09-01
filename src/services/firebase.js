import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAknWXvZK9P7W11REDGr43m8Eb4fApdNx8",
    authDomain: "latnix-23a2f.firebaseapp.com",
    databaseURL: "https://latnix-23a2f.firebaseio.com",
    projectId: "latnix-23a2f",
    storageBucket: "latnix-23a2f.appspot.com",
    messagingSenderId: "621412258189",
    appId: "1:621412258189:web:6b10a6a3a4c7641acbadc4",
    measurementId: "G-X0619H7G1N"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const db = firebase.database();
export const storage = firebase.storage();

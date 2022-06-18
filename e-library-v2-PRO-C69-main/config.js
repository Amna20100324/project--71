import firbase from "firebase";
require("@firestore/firebase");

const firebaseConfig = {
    apiKey: "AIzaSyD9xqCK85CGFiVpuhGQqv35PJSp-UKICgU",
    authDomain: "e-library-e122b.firebaseapp.com",
    projectId: "e-library-e122b",
    storageBucket: "e-library-e122b.appspot.com",
    messagingSenderId: "281967404207",
    appId: "1:281967404207:web:c6bb305acdb58f9244605a"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
  
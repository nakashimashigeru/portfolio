import firebase from "firebase/compat/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyB3P1ANq7Ukl3woyc3eWXrXINcVhNnIys8",
  authDomain: "project-7508986809828098372.firebaseapp.com",
  projectId: "project-7508986809828098372",
  storageBucket: "project-7508986809828098372.appspot.com",
  messagingSenderId: "304501196966",
  appId: "1:304501196966:web:dd5e3129177395a2730c67"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export { auth, provider };

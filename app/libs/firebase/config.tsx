import firebase from "firebase/compat/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export { auth, provider };

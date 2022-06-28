import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA1mua0ItBSCgW9FL-WUWiElUaSN27rvnE",
    authDomain: "twitter-2-78c47.firebaseapp.com",
    projectId: "twitter-2-78c47",
    storageBucket: "twitter-2-78c47.appspot.com",
    messagingSenderId: "205744448472",
    appId: "1:205744448472:web:33ce6ca88bda699b6a08ad"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
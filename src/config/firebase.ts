// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMuE8I8HvdrdJw6crb27YJWAawghhacck",
  authDomain: "mock-insta.firebaseapp.com",
  projectId: "mock-insta",
  storageBucket: "mock-insta.appspot.com",
  messagingSenderId: "1020780617295",
  appId: "1:1020780617295:web:7b93ea75f3e99500fc143a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export {app, db, storage};
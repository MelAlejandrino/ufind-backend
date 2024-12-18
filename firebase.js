import { initializeApp } from 'firebase/app';
import config from './config.js';

const firebaseApp = initializeApp(config.firebaseConfig);
export default firebaseApp;
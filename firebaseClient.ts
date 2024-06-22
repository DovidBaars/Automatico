import {
	FirebaseApp,
	FirebaseOptions,
	getApps,
	initializeApp,
} from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.FIREBASE_API_KEY,
	projectId: process.env.FIREBASE_PROJECT_ID,
};

const app: FirebaseApp =
	getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db: Firestore = getFirestore(app);

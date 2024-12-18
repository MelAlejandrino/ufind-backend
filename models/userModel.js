import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import firebaseApp from '../firebase.js';

const db = getFirestore(firebaseApp);

export const updateUser = async (studentId, updates) => {
    const userRef = doc(db, 'users', studentId); // Directly reference the document by studentId

    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        return null; // User not found
    }

    // Update user details in Firestore
    await updateDoc(userRef, updates);

    // Return updated data
    return { id: studentId, ...userSnap.data(), ...updates };
};




export const getUser = async (studentId) => {
    const userRef = doc(db, 'users', studentId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return null; // User not found
    }

    return { id: studentId, ...userSnap.data() };
};


export const addUser = async (userData) => {
    const { studentId, ...restData } = userData;
    const userRef = doc(db, "users", studentId);

    try {
        await setDoc(userRef, restData); // Store user details in Firestore
        return studentId; // Return the document ID
    } catch (error) {
        throw new Error("Error adding user: " + error.message);
    }
};


export const getUserById = async (studentId) => {
    const userRef = doc(db, 'users', studentId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error('User not found');
    }

    return { id: studentId, ...userSnap.data() };
};


import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import firebaseApp from '../firebase.js';

const db = getFirestore(firebaseApp);

export const getAdmin = async (username) => {
    // Create a query to find the admin by username
    const adminQuery = query(collection(db, 'admin'), where('username', '==', username));
    const adminSnapshot = await getDocs(adminQuery);

    // Check if any admin was found
    if (adminSnapshot.empty) {
        return null; // No admin found
    }

    // Map over the found documents and return the first one (assuming usernames are unique)
    const adminList = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return adminList[0]; // Return the first matching admin
};
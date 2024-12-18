import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";

const db = getFirestore(firebaseApp);

export const updateItem = async (itemID, updateData) => {
  try {
      const itemRef = doc(db, "items", itemID);
      await updateDoc(itemRef, updateData); // Update the document with the provided data
  } catch (error) {
      throw new Error("Error updating item: " + error.message);
  }
};

export const deleteItem = async (itemID) => {
    try {
        const itemRef = doc(db, "items", itemID);
        await deleteDoc(itemRef); // Delete the document
    } catch (error) {
        throw new Error("Error deleting item: " + error.message);
    }
};

export const addItem = async (itemData) => {
  try {
    const newItem = {
      ...itemData, // Include all fields, including imageURL
    };

    const docRef = await addDoc(collection(db, "items"), newItem);
    return docRef.id; // Return the ID of the newly created document
  } catch (error) {
    throw new Error("Error adding item: " + error.message);
  }
};

export const getItems = async () => {
  try {
    const itemsCollection = collection(db, "items");
    const snapshot = await getDocs(itemsCollection);
    const itemsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return itemsList; // Return the list of items
  } catch (error) {
    throw new Error("Error retrieving items: " + error.message);
  }
};

export const addClaimItem = async (claimData) => {
  try {
    const newItem = {
      ...claimData, // Include all fields, including imageURL
    };

    const docRef = await addDoc(collection(db, "Claim"), newItem);
    return docRef.id; // Return the ID of the newly created document
  } catch (error) {
    throw new Error("Error adding item: " + error.message);
  }
};

export const getItemsByUserId = async (studentId) => {
  try {
    const itemsCollection = collection(db, "items");
    const q = query(itemsCollection, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return []; // Return empty array if no items are found
    }

    const itemsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return itemsList;
  } catch (error) {
    throw new Error("Error retrieving items: " + error.message);
  }
};

export const getPendingItem = async (status) => {
  try {
    const itemsCollection = collection(db, "items");
    const q = query(itemsCollection, where("ticket", "==", status));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return []; // Return empty array if no items are found
    }

    const itemsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return itemsList;
  } catch (error) {
    throw new Error("Error retrieving tickets: " + error.message);
  }
};

export const getItemById = async (itemID) => {
  try {
    const docRef = doc(db, "items", itemID); // Reference to the specific item
    const docSnap = await getDoc(docRef); // Fetch the document

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }; // Return the item if it exists
    } else {
      throw new Error("Item not found"); // Return error if no item exists
    }
  } catch (error) {
    throw new Error("Error retrieving item: " + error.message);
  }
};

import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, onSnapshot, doc, setDoc, getDoc,  } from "firebase/firestore";
import firebaseApp from '../firebase.js';

const db = getFirestore(firebaseApp);

async function getUserDataById(userId) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data(); // Return user data if the document exists
  }
  return null; // Return null if user not found
}

export const messageModel = {
  async createOrGetChat(senderId, recipientId) {
    // Create a consistent chat ID by sorting participant IDs
    const participants = [senderId, recipientId].sort();
    const chatId = `${participants[0]}_${participants[1]}`;

    const chatRef = doc(db, "chats", chatId);

    // Check if the chat exists, otherwise create it
    await setDoc(chatRef, { participants }, { merge: true });
    return chatId;
  },

  async createMessage(chatId, message) {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    return await addDoc(messagesRef, message);
  },

  async fetchMessages(chatId) {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  listenToMessages(chatId, callback) {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    return onSnapshot(q, snapshot => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
  },

  async getChatIdByUser(userId) {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const chatDoc = querySnapshot.docs[0]; // Assuming only one chat with the user
      return chatDoc.id;
    }

    return null; // No chat found
  },

  async getChatsByUser(userId) {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const chatDataPromises = querySnapshot.docs.map(async (doc) => {
        const chatData = doc.data();
        const otherParticipant = chatData.participants.filter(participant => participant !== userId)[0]; // Get the opposing user ID

        // Fetch the data of the opposing user
        const otherUserData = await getUserDataById(otherParticipant);

        return {
          chatId: doc.id,
          otherUserId: otherParticipant,
          otherUserData, // Include the data of the other user
          participants: chatData.participants
        };
      });

      const chatsData = await Promise.all(chatDataPromises); // Wait for all promises to resolve
      return chatsData;
    }

    return []; // Return an empty array if no chats are found
  },  
};

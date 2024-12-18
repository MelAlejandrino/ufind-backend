import express from 'express';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";

const db = getFirestore(firebaseApp);

const router = express.Router();

// GET request to fetch notifications based on userId
router.get('/getNotifications', async (req, res) => {
  const { userId } = req.query;  // Get the userId from the query params
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // 1. Query the 'items' collection for items where userId matches the provided userId
    const itemsCollection = collection(db, 'items');
    const itemsQuery = query(itemsCollection, where('studentId', '==', userId));
    const itemsSnapshot = await getDocs(itemsQuery);
    
    if (itemsSnapshot.empty) {
      return res.status(404).json({ message: 'No items found for this user.' });
    }

    // 2. Get the itemIds from the items that match the userId
    const itemIds = itemsSnapshot.docs.map(itemDoc => itemDoc.id);
    
    // 3. Query the 'Claims' collection for claims where itemId is in the itemIds
    const claimsCollection = collection(db, 'Claim');
    const claimsQuery = query(claimsCollection, where('itemId', 'in', itemIds));
    const claimsSnapshot = await getDocs(claimsQuery);

    if (claimsSnapshot.empty) {
      return res.status(404).json({ message: 'No claims found for this user.' });
    }

    // 4. Combine matching claims and items into notifications
    const notifications = claimsSnapshot.docs.map(claimDoc => {
      const claimData = claimDoc.data();
      return {
        id: claimDoc.id,
        message: `Someone is trying to claim your item: ${claimData.name}`,
        claimDetails: claimData
      };
    });

    // 5. Return the notifications
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

export default router;

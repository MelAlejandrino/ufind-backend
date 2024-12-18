import express from 'express';
import { 
    addItemHandler, 
    getItemByIdHandler, 
    getItemsHandler, 
    getItemsByUserIdHandler, 
    getPendingHandler, 
    claimItemHandler,
    updateItemHandler,
    deleteItemHandler,
} from '../controllers/itemController.js';

const router = express.Router();

router.post('/items', addItemHandler); // Route for adding items
router.post('/items/claim', claimItemHandler);
router.get('/items', getItemsHandler);  // Route for getting all items
router.get('/items/:itemID', getItemByIdHandler);
router.get('/items/user/:userId', getItemsByUserIdHandler); // Route to fetch items by userId
router.get('/items/status/:status', getPendingHandler); // Route to fetch pending items
router.put('/items/:itemID', updateItemHandler); // Route for updating an item (mark as success)
router.delete('/items/:itemID', deleteItemHandler); // Route for deleting an item

export default router;

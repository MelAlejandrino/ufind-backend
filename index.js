import express from 'express';
import cors from 'cors';
import config from './config.js';
import adminRoute from './routes/adminRoute.js';
import itemRoute from './routes/itemRoute.js'; // Import the item route
import userRoute from './routes/userRoute.js'; // Import the user route
import notificationRoute from './routes/notificationRoute.js'; //
import messageRoute from './routes/messageRoute.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', adminRoute); // Admin routes
app.use('/api', itemRoute);   // Item routes
app.use('/api', userRoute);
app.use('/api', notificationRoute);
app.use("/api", messageRoute);

app.listen(config.port, () => {
    console.log(`Server is live @ ${config.hostUrl}`);
});
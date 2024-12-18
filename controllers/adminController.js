import { getAdmin } from '../models/adminModel.js';

export const getAdminHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await getAdmin(username);

        if (admin && admin.password === password) {
            res.status(200).json({ message: 'Login successful', admin });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
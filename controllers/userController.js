import { getUser, addUser, updateUser, getUserById } from '../models/userModel.js';
import crypto from 'crypto';


const hashPassword = (password, salt) => {
    const hash = crypto.createHash("sha256");
    hash.update(salt + password); // Combine password with salt
    return hash.digest("hex");
};


export const updateUserHandler = async (req, res) => {
    const { studentId, contactNumber, emailAddress, firstName} = req.body;

    if (!studentId) {
        return res.status(400).json({ message: 'Student ID is required' });
    }

    try {
        const updates = {
            ...(contactNumber && { contactNumber }),
            ...(emailAddress && { emailAddress }),
            ...(firstName && { firstName }),
        };

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        const updatedUser = await updateUser(studentId, updates);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        console.error("Error in updateUserHandler:", error);
        res.status(500).send(error.message);
    }
};



export const getUserHandler = async (req, res) => {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
        return res.status(400).json({ message: "Student ID and password are required" });
    }

    try {
        // Fetch user from Firestore
        const user = await getUser(studentId);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Retrieve the stored hash and salt
        const { password: storedHash, salt } = user;

        // Hash the input password with the stored salt
        const hash = crypto.createHash("sha256");
        hash.update(salt + password);
        const hashedInputPassword = hash.digest("hex");

        // Compare the hashes
        if (hashedInputPassword === storedHash) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials." });
        }
    } catch (error) {
        console.error("Error in getUserHandler:", error);
        res.status(500).send(error.message);
    }
};


export const addUserHandler = async (req, res) => {
    const { firstName, lastName, emailAddress, contactNumber, password, studentId } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !emailAddress || !contactNumber || !password || !studentId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Generate salt
        const salt = crypto.randomBytes(16).toString("hex");

        // Hash the password with the salt
        const hashedPassword = hashPassword(password, salt);

        // Create the user object
        const newUser = {
            firstName,
            lastName,
            emailAddress,
            contactNumber,
            password: hashedPassword, // Store hashed password
            salt, // Store the salt for validation later
            studentId,
        };

        const userId = await addUser(newUser); // Save user to Firestore
        res.status(201).json({ message: "User added successfully", userId });
    } catch (error) {
        console.error("Error in addUserHandler:", error);
        res.status(500).send(error.message);
    }
};

export const getUserByIdHandler = async (req, res) => {
    const { studentId } = req.params; // Get the item ID from URL parameters

    try {
        const user = await getUserById(studentId); // Fetch item by ID
        res.status(200).json(user); // Send the item data as a response
    } catch (error) {
        res.status(500).json({ message: `Error retrieving user: ${error.message}` });
    }
};
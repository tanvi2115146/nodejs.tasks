const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;
const FILE_PATH = path.join(__dirname, 'users.json');

// Middleware to handle JSON requests
app.use(express.json());

// Function to read users 
const getUsers = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        return [];
    }
};

// Function to write users 
const saveUsers = (users) => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing file:", error);
    }
};


app.get('/',(req,res)=>{
    res.json("API is working");
})

// GET all users
app.get('/users', (req, res) => {
    const users = getUsers();
    res.json(users);
});

// POST  (Create)
app.post('/users', (req, res) => {
    const users = getUsers();
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "All fields are required: first_name, last_name, email, password" });
    }

    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        first_name,
        last_name,
        email,
        password
    };

    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
});

// Update user
app.put('/users/:id', (req, res) => {
    const users = getUsers();
    const id = Number(req.params.id);
    const { first_name, last_name, email, password } = req.body;

    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    // Update only the provided fields
    users[userIndex] = {
        ...users[userIndex],
        first_name: first_name || users[userIndex].first_name,
        last_name: last_name || users[userIndex].last_name,
        email: email || users[userIndex].email,
        password: password || users[userIndex].password
    };

    saveUsers(users);
    res.json(users[userIndex]);
});

// DELETE a user
app.delete('/users/:id', (req, res) => {
    const users = getUsers();
    const id = Number(req.params.id);

    const updatedUsers = users.filter(user => user.id !== id);

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ error: "User not found" });
    }

    saveUsers(updatedUsers);
    res.json({ message: "User deleted successfully" });
});

// Error Handling for invalid requests
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

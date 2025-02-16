const exp = require('express');
const con = require('./db')// Import database connection

const route = exp();

route.use(exp.json());

// GET all users from PostgreSQL
route.get('/student', async (req, res) => {
    try {
        const result = await con.query("SELECT * FROM student");
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST a new user (Insert into PostgreSQL)
route.post('/student', async (req, res) => {
    try {
        const { Name, Email } = req.body;
        if (!Name || !Email) {
            return res.status(400).json({ error: "Name and Email are required" });
        }
        const result = await con.query(
            'INSERT INTO student ("Name", "Email") VALUES ($1, $2) RETURNING *',
            [Name, Email]
        );
            res.status(201).json(result.rows[0]); 
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


// PUT (Update user in PostgreSQL)
route.put('/student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Email } = req.body;

        // Check if ID is valid
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        if (!Name && !Email) {
            return res.status(400).json({ error: "At least one field (Name or Email) is required" });
        }

        // Build dynamic update query
        let query = "UPDATE student SET ";
        let values = [];
        let count = 1;

        if (Name) {
            query += ` "Name" = $${count}, `;
            values.push(Name);
            count++;
        }

        if (Email) {
            query += ` "Email" = $${count}, `;
            values.push(Email);
            count++;
        }
        query = query.slice(0, -2);
        query += ` WHERE id = $${count} RETURNING *`;
        values.push(id);

        const result = await con.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" ,details: error.message});
    }
});


// DELETE a user from PostgreSQL
route.delete('/student/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await con.query(
            "DELETE FROM student WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
const PORT = 8000;
route.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});






































require('dotenv').config();
const express = require('express');
const pool = require('./db'); // Import database connection

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});

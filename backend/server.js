const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database (creates 'forum.db' if it doesn't exist)
const db = new sqlite3.Database("./forum.db", (err) => {
    if (err) {
        console.error("Error connecting to SQLite:", err);
        return;
    }
    console.log("Connected to SQLite database");
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            parent_id INTEGER NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (parent_id) REFERENCES comments(id)
        )`
    );
});

// Create a post
app.post("/api/posts", (req, res) => {
    const { title, content } = req.body;
    const query = `INSERT INTO posts (title, content) VALUES (?, ?)`;

    db.run(query, [title, content], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// Get all posts (sorted)
app.get("/api/posts", (req, res) => {
    const { sortBy } = req.query;
    let query = `SELECT * FROM posts ORDER BY created_at DESC`;

    if (sortBy === "comments") {
        query = `
            SELECT p.*, COUNT(c.id) AS comment_count
            FROM posts p
            LEFT JOIN comments c ON c.post_id = p.id
            GROUP BY p.id
            ORDER BY comment_count DESC
        `;
    }

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create a comment
app.post("/api/comments", (req, res) => {
    const { post_id, content, parent_id } = req.body;
    const query = `INSERT INTO comments (post_id, content, parent_id) VALUES (?, ?, ?)`;

    db.run(query, [post_id, content, parent_id || null], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// Get comments for a specific post
app.get("/api/comments/:post_id", (req, res) => {
    const { post_id } = req.params;
    const query = `SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC`;

    db.all(query, [post_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

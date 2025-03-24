const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Tady můžeš změnit uživatele podle tvé konfigurace
    password: '', // Zadej heslo pro připojení k MariaDB
    database: 'forum' // Název databáze, kterou chceš použít
});

db.connect((err) => {
    if (err) {
        console.error('Chyba připojení k databázi:', err);
        return;
    }
    console.log('Připojeno k databázi');
});

app.use(cors());
app.use(express.json());

app.post('/api/posts', (req, res) => {
    const { title, content } = req.body;
    const query = 'INSERT INTO posts (title, content) VALUES (?, ?)';
    db.query(query, [title, content], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId });
    });
});

app.get('/api/posts', (req, res) => {
    const { sortBy } = req.query; // sortBy může být 'time' nebo 'comments'

    let query = 'SELECT * FROM posts';
    if (sortBy === 'comments') {
        query = `
      SELECT p.*, COUNT(c.id) AS comment_count 
      FROM posts p
      LEFT JOIN comments c ON c.post_id = p.id
      GROUP BY p.id
      ORDER BY comment_count DESC
    `;
    } else {
        query += ' ORDER BY created_at DESC';
    }

    db.query(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/comments', (req, res) => {
    const { post_id, content, parent_id } = req.body;
    const query = 'INSERT INTO comments (post_id, content, parent_id) VALUES (?, ?, ?)';
    db.query(query, [post_id, content, parent_id || null], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId });
    });
});

app.get('/api/comments/:post_id', (req, res) => {
    const { post_id } = req.params;
    const query = `
    SELECT * FROM comments 
    WHERE post_id = ? 
    ORDER BY created_at ASC
  `;

    db.query(query, [post_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
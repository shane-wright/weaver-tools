import axios from "axios"
import express from "express"

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = express.Router();

// Open the database connection
const dbPromise = open({
    filename: 'chat.db',
    driver: sqlite3.Database
});

router.get("/", (req, res) => {
    res.send("Hello World!")
})

router.post("/chat", async (req, res) => {
    const { model, messages } = req.body

    try {
        const response = await axios.post("http://localhost:11434/api/chat", {
            model,
            messages,
            stream: false
        })

        res.json(response.data)

    } catch (error) {
        res.status(500).send(error.toString())
    }
})

// GET /tags
router.get('/tags', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:11434/api/tags');
        const models = response.data.models.map(model => {
            const name = model.name || '';
            const description = name.split(':').shift().replace('-', ' ');
            return { name, description };
        });
        res.json(models);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// POST /initialize_db
router.post('/initialize_db', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.exec(`
            CREATE TABLE IF NOT EXISTS chat_history (
                id TEXT PRIMARY KEY NOT NULL,
                description TEXT NOT NULL,
                messages TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY NOT NULL,
                preferences TEXT NOT NULL
            );
        `);
        res.send('Database initialized');
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// POST /create_chat_dialog
router.post('/create_chat_dialog', async (req, res) => {
    const { id, description, messages } = req.body;
    try {
        const db = await dbPromise;
        await db.run(
            'INSERT INTO chat_history (id, description, messages) VALUES (?, ?, ?)',
            [id, description, messages]
        );
        res.send('Chat dialog created');
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// POST /update_chat_dialog
router.post('/update_chat_dialog', async (req, res) => {
    const { id, messages } = req.body;
    try {
        const db = await dbPromise;
        await db.run(
            'UPDATE chat_history SET messages = ? WHERE id = ?',
            [messages, id]
        );
        res.send('Chat dialog updated');
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// POST /get_chat_dialog
router.post('/get_chat_dialog', async (req, res) => {
    const { id } = req.body;
    try {
        const db = await dbPromise;
        const messages = await db.all(
            'SELECT messages FROM chat_history WHERE id = ?',
            [id]
        );
        res.json(messages);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

export default router

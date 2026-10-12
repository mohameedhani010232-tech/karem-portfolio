const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const port = 3000;

// Live online visitors counter
let onlineUsers = 0;

io.on('connection', (socket) => {
    onlineUsers++;
    io.emit('online_users', { count: onlineUsers });

    socket.on('disconnect', () => {
        onlineUsers = Math.max(0, onlineUsers - 1);
        io.emit('online_users', { count: onlineUsers });
    });
});

app.get('/api/online-users', (req, res) => {
    res.json({ count: onlineUsers });
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Database config
const db = new sqlite3.Database('./portfolio.db', (err) => {
    if (err) {
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            category TEXT,
            image_url TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            category TEXT,
            video_url TEXT,
            thumbnail_url TEXT
        )`);
    }
});

// Admin Authentication
const ADMIN_PASSWORD = '112003';

const verifyAdmin = (req, res, next) => {
    const key = req.headers['x-admin-key'];
    if (key === ADMIN_PASSWORD) {
        return next();
    }
    return res.status(401).json({ error: 'غير مصرح: كلمة المرور غير صحيحة' });
};

// Login API
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        return res.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
    }
    return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
});

// APIs for Portfolio Images
app.get('/api/portfolio', (req, res) => {
    db.all('SELECT * FROM portfolio', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/portfolio', verifyAdmin, upload.single('image'), (req, res) => {
    const { title, category } = req.body;
    const imageUrl = req.file ? '/uploads/' + req.file.filename : '';

    db.run('INSERT INTO portfolio (title, category, image_url) VALUES (?, ?, ?)',
        [title, category, imageUrl],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, category, image_url: imageUrl });
        }
    );
});

app.delete('/api/portfolio/:id', verifyAdmin, (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM portfolio WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// APIs for Videos
app.get('/api/videos', (req, res) => {
    db.all('SELECT * FROM videos', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/videos', verifyAdmin, upload.single('thumbnail'), (req, res) => {
    const { title, category, video_url } = req.body;
    const thumbnailUrl = req.file ? '/uploads/' + req.file.filename : '';

    db.run('INSERT INTO videos (title, category, video_url, thumbnail_url) VALUES (?, ?, ?, ?)',
        [title, category, video_url, thumbnailUrl],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, category, video_url, thumbnail_url: thumbnailUrl });
        }
    );
});

app.delete('/api/videos/:id', verifyAdmin, (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM videos WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

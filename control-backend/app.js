const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 連接 MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// 公告 Schema
const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Announcement = mongoose.model('Announcement', announcementSchema);

// 使用者 Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }
});
const User = mongoose.model('User', userSchema);

// 發佈公告
app.post('/control/api/announcements', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: '公告標題和內容是必需的。' });
    }

    try {
        const announcement = new Announcement({ title, content });
        await announcement.save();
        res.status(201).json(announcement); // 返回創建的公告
    } catch (error) {
        console.error('發佈公告錯誤:', error);
        res.status(500).json({ error: '發佈公告時發生錯誤。請稍後再試。' });
    }
});

// 查詢公告
app.get('/control/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.json(announcements);
    } catch (error) {
        console.error('查詢公告錯誤:', error);
        res.status(500).json({ error: '查詢公告時發生錯誤。' });
    }
});

// 刪除公告
app.delete('/control/api/announcements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Announcement.findByIdAndDelete(id);
        if (result) {
            res.sendStatus(204); // 204 No Content
        } else {
            res.sendStatus(404); // 404 Not Found
        }
    } catch (error) {
        console.error('刪除公告錯誤:', error);
        res.status(500).json({ error: '刪除公告時發生錯誤。' });
    }
});

// 新增使用者
app.post('/control/api/users', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: '使用者名稱是必需的。' });
    }

    try {
        const user = new User({ username });
        await user.save();
        res.status(201).json(user); // 返回創建的使用者
    } catch (error) {
        console.error('添加使用者錯誤:', error);
        res.status(500).json({ error: '添加使用者時發生錯誤。' });
    }
});

// 查詢使用者
app.get('/control/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('查詢使用者錯誤:', error);
        res.status(500).json({ error: '查詢使用者時發生錯誤。' });
    }
});

// 刪除使用者
app.delete('/control/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);
        if (result) {
            res.sendStatus(204); // 204 No Content
        } else {
            res.sendStatus(404); // 404 Not Found
        }
    } catch (error) {
        console.error('刪除使用者錯誤:', error);
        res.status(500).json({ error: '刪除使用者時發生錯誤。' });
    }
});

// 查詢打卡記錄
app.get('/api/records', async (req, res) => {
    try {
        const records = await CheckIn.find().populate('userId', 'username'); // 確保你從 CheckIn 中查詢資料
        res.json(records);
    } catch (error) {
        console.error('查詢打卡記錄錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 新增控制台頁面路由
app.get('/control', (req, res) => {
    res.sendFile(path.join(__dirname, 'control.html'));
});

// 啟動服務
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Control backend is running on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const app = express();

app.use(express.json());

// 设置 strictQuery 选项
mongoose.set('strictQuery', true); // 或者 false，根据需求

// 连接到 MongoDB
mongoose.connect('mongodb://db:27017/book-exchange')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// 使用 API 路由
app.use('/api', apiRoutes);

// 启动服务器
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

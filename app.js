require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const multer = require('multer');
const sequelize = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

/// 测试数据库连接
sequelize.authenticate()
    .then(() => console.log('数据库连接成功'))
    .catch(err => console.error('数据库连接失败', err));

/// 自动创建表
sequelize.sync({ force: false });

/// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(express.static('public'));

app.use('/upload', require('./routes/upload'));

app.use(express.json());

// 路由
app.use('/users', require('./routes/user'));


// 全局错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器错误' });
});

app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
})
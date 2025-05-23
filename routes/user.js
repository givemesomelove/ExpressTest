const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');

/// 用户注册
router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/// 用户登录（生成 JWT）
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ 
            where: { 
                username: req.body.username
            }
        })
        if (!user) throw new Error('用户不存在');

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) throw new Error('密码错误');

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

/// 获取用户信息(需认证)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: '用户不存在' });
    }
});

module.exports = router;
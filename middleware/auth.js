const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('./auth');

const baseAuth = async (req) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw new Error('未授权');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) throw new Error('用户不存在');

        // 将用户信息附加到请求对象
        req.user = user;
        return true;
    } catch (err) {
        return false;
    }
}

const httpAuth = async (req, resizeBy, next) => {
    const authSuccess = await baseAuth(req);
    if (authSuccess) {
        next();
    } else {
        res.status(401).json({ error: '无效令牌' });
    }
}

const wsAuth = async (req, socket) => {
    const authSuccess = await baseAuth(req);
    if (authSuccess) {
        return true;
    } else {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return false;
    }
}

module.exports = {
    httpAuth,
    wsAuth
}
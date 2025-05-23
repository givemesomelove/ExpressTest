const { WebSocket } = require('ws');
const { wsAuth } = require('../middleware/auth');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    // // 鉴权
    // server.on('upgrade', async (req, socket, head) => {
    //     const authPassed = await wsAuth(req, socket) // 传入socket对象
    //     if (authPassed) {
    //         wss.handleUpgrade(req, socket, head, (ws) => {
    //             wss.emit('connection', ws, req);
    //         });
    //     }
    // })

    wss.on('connection', (ws) => {
        console.log('新的WebSocket连接建立');

        /// 收到消息
        ws.on('message', (message) => {
            console.log('收到消息:', message.toString());

            wss.clients.forEach ((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        });

        /// 连接断开
        ws.on('close', () => {
            console.log('连接关闭');
        });
    });

    return wss;
}

module.exports = setupWebSocket;
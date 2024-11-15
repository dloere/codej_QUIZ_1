const express = require('express');
const ping = require('ping');  // ICMP ping 패키지
const net = require('net');    // TCP 연결을 확인할 수 있는 Node.js 내장 모듈

const app = express();
const port = 3000;

// CORS 설정 (프론트엔드에서 요청을 허용)
const cors = require('cors');
app.use(cors());

// Ping 요청 처리
app.get('/ping', async (req, res) => {
    const ip = req.query.ip;  // IP 주소를 쿼리 파라미터로 받음
    const port = req.query.port;  // 포트 번호를 쿼리 파라미터로 받음

    if (!ip) {
        return res.status(400).json({ message: 'IP address is required.' });
    }

    try {
        // ICMP ping을 먼저 실행
        const pingResult = await ping.promise.probe(ip);

        if (pingResult.alive) {
            // IP가 살아있는 경우 포트가 열려있는지 확인
            if (port) {
                const isPortOpen = await checkPort(ip, port);
                res.json({
                    message: `Ping to ${ip} was successful.`,
                    portStatus: isPortOpen ? `Port ${port} is open.` : `Port ${port} is closed.`
                });
            } else {
                res.json({ message: `Ping to ${ip} was successful.` });
            }
        } else {
            res.json({ message: `Ping to ${ip} failed.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error pinging the IP address.' });
    }
});

// 포트가 열려 있는지 확인하는 함수
const checkPort = (ip, port) => {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        const timeout = 3000; // 타임아웃 설정 (3초)

        socket.setTimeout(timeout);
        socket.on('connect', () => {
            socket.end();
            resolve(true);  // 포트가 열려 있음
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);  // 타임아웃 (포트가 닫혀 있음)
        });

        socket.on('error', () => {
            resolve(false);  // 포트 연결 실패
        });

        socket.connect(port, ip);  // 주어진 IP와 포트로 연결 시도
    });
};

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

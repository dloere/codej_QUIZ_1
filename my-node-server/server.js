const express = require('express');
const ping = require('ping');  // ICMP ping 패키지
const net = require('net');    // TCP 연결을 확인할 수 있는 Node.js 내장 모듈
const iconv = require('iconv-lite');  // iconv-lite 라이브러리 추가
const axios = require('axios');  // axios
const https = require('https');

const app = express();
const port = 3000;

const traceroute = require('traceroute');
// const fast = require('fast-cli');

const { exec } = require('child_process');

// CORS 설정 (프론트엔드에서 요청을 허용)
const cors = require('cors');
app.use(cors());

// JSON 형태의 데이터 파싱
app.use(express.json());

// URL 인코딩된 데이터 파싱 (폼 데이터)
app.use(express.urlencoded({ extended: true }));


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
                    message: `Ping to ${ip} was successful.` + (isPortOpen ? `Port ${port} is open.` : `Port ${port} is closed.`),
                    portStatus: isPortOpen,
                    ipStatus: true,
                });
            } else {
                res.json({ message: `Ping to ${ip} was successful.`, ipStatus: true, time: pingResult.time });
            }
        } else {
            res.json({ message: `Ping to ${ip} failed.`, ipStatus: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error pinging the IP address.', ipStatus: false });
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


app.get('/get-router-ip', (req, res) => {
    exec('chcp 65001 & ipconfig', { encoding: 'binary' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        const decodedStdout = iconv.decode(Buffer.from(stdout, 'binary'), 'utf-8');
        console.log(decodedStdout);  // 제대로 출력되는지 확인

        // 정규 표현식 실행 (필요한 정보를 추출)
        const match = decodedStdout.match(/Default Gateway[ .:]+([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
        if (match && match[1]) {
            routerIP = match[1];
            return res.json({ routerIP });
        } else {
            return res.status(404).json({ error: 'Router IP not found' });
        }
    });
})

app.post('/check-connectivity', async (req, res) => {
    const { address } = req.body;  // 사용자로부터 IP나 도메인 주소를 받음

    try {
        // 1. Ping 테스트 시도
        const pingResult = await ping.promise.probe(address);

        if (pingResult.alive) {
            return res.json({ method: 'ping', reachable: true, status: 'Ping successful' });
        } else {
            // 2. Ping 실패 시 Axios로 HTTP 요청 시도
            try {
                const response = await axios.get(`http://${address}`);
                return res.json({ method: 'axios', reachable: true, status: response.status });
            } catch (httpError) {
                return res.json({ method: 'axios', reachable: false, status: httpError.message });
            }
        }
    } catch (error) {
        res.json({ method: 'ping', reachable: false, status: 'Ping failed and HTTP request failed' });
    }
});

app.get('/speedtest', async (req, res) => {
    const FastSpeedtest = require("fast-speedtest-api");

    let speedtest = new FastSpeedtest({
        token: await getToken(), // required
        verbose: false, // default: false
        timeout: 10000, // default: 5000
        https: true, // default: true
        urlCount: 5, // default: 5
        bufferSize: 8, // default: 8
        unit: FastSpeedtest.UNITS.Mbps, // default: Bps
        proxy: 'http://optional:auth@my-proxy:123' // default: undefined
    });

    speedtest.getSpeed().then(s => {
        res.json({ downloadSpeed: s });
    }).catch(e => {
        console.error(e.message);
    });
});

const puppeteer = require('puppeteer');

async function getToken() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://fast.com');

    // 페이지의 네트워크 요청을 확인하여 토큰을 추출합니다
    const response = await page.waitForResponse(response =>
        response.url().includes('/netflix/speedtest') &&
        response.status() === 200
    );
    const url = response.url();
    const token = new URL(url).searchParams.get('token');

    await browser.close();
    return token;
}



app.get('/traceroute', (req, res) => {
    try {
        const host = req.query.ip;

        traceroute.trace('8.8.8.8', (err, hops) => {
            if (err) {
                res.status(500).json({ error: 'Traceroute failed', message: err.message });
            } else {
                res.json({ hops: hops });
            }
        });
    } catch (e) {
        res.json({ method: 'ping', reachable: false, status: 'Ping failed and HTTP request failed' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

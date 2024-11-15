<template>
    <div id="app">
        <h1>Network Speed Test</h1>

        <div>
        <h2>Ping Test (Internal Network)</h2>
        <input v-model="pingHost" placeholder="Enter host (e.g., google.com)" />
        <button @click="pingTest">Test Ping</button>
        <p v-if="pingResult">Ping Time: {{ pingResult }} ms</p>
        </div>

        <div>
        <h2>Speed Test (External Network)</h2>
        <button @click="speedTest">Test Speed</button>
        <p v-if="speedResult">Download: {{ speedResult.download }} Mbps</p>
        <p v-if="speedResult">Upload: {{ speedResult.upload }} Mbps</p>
        <p v-if="speedResult">Ping: {{ speedResult.ping }} ms</p>
        </div>

        <div>
        <h2>Traceroute Test (Specific Site)</h2>
        <input v-model="tracerouteHost" placeholder="Enter host (e.g., google.com)" />
        <button @click="tracerouteTest">Test Traceroute</button>
        <div v-if="tracerouteResult">
            <ul>
            <li v-for="(hop, index) in tracerouteResult" :key="index">
                Hop {{ index + 1 }}: {{ hop }}
            </li>
            </ul>
        </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            pingHost: 'google.com',
            pingResult: null,
            speedResult: null,
            tracerouteHost: 'google.com',
            tracerouteResult: null,
        };
    },
    methods: {
        async pingTest() {
            try {
                const url = `http://localhost:3000/ping?ip=${this.pingHost}`
                const response = await fetch(url);
                const data = await response.json();
                this.pingResult = data.time;
            } catch (error) {
                console.error('Ping test failed', error);
            }
        },
        async speedTest() {
        try {
            const response = await axios.get('http://localhost:3000/api/speedtest');
            this.speedResult = response.data;
        } catch (error) {
            console.error('Speed test failed', error);
        }
        },
        async tracerouteTest() {
        try {
            const response = await axios.get(`http://localhost:3000/api/traceroute/${this.tracerouteHost}`);
            this.tracerouteResult = response.data.hops;
        } catch (error) {
            console.error('Traceroute test failed', error);
        }
        },
    },
};
</script>

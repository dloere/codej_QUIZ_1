<template>
    <div id="app">
        <h1>Network Speed Test</h1>

        <div style="height: 200px; border:1px solid; overflow: auto;">
            <h1>도움말</h1>
            <div>사용용도 : 속도 측정(ping, downlaod) // upload미개발</div> 
        </div>

        <input v-model="host" placeholder="Enter host (e.g., google.com)" />
        <button @click="totalTest">스피드 테스트</button>

        <div v-if="loading" style="color: red">Loading...</div>

        <div v-if="pingResult">
            <p>Ping Time: {{ pingResult }} ms</p>
        </div>

        <div v-if="speedResult.download">
            <p>Download: {{ speedResult.download }} Mbps</p>
            <!-- <p>Upload: {{ speedResult.upload }} Mbps</p>
            <p>Ping: {{ speedResult.ping }} ms</p> -->
        </div>

        <div v-if="tracerouteResult">
            <ul>
            <li v-for="(hop, index) in tracerouteResult" :key="index">
                Hop {{ index + 1 }}: {{ hop }}
            </li>
            </ul>
        </div>
    </div>
</template>

<script>
// import axios from 'axios';

export default {
    data() {
        return {
            host: 'google.com',
            pingResult: null,
            speedResult: {},
            tracerouteHost: 'google.com',
            tracerouteResult: null,
            loading: false
        };
    },
    methods: {
        async totalTest() {
            this.loading = true
            await this.pingTest()
            await this.speedTest()
            this.loading = false
            // await this.tracerouteTest()
        },

        async pingTest() {
            try {
                const url = `http://localhost:3000/ping?ip=${this.host}`
                const response = await fetch(url);
                const data = await response.json();
                this.pingResult = data.time;
            } catch (error) {
                console.error('Ping test failed', error);
            }
        },
        async speedTest() {
            try {
                const url = `http://localhost:3000/speedtest`
                const response = await fetch(url);
                const data = await response.json();
                this.speedResult.download = data.downloadSpeed;
            } catch (error) {
                console.error('Speed test failed', error);
            }
        },
        // async tracerouteTest() {
        //     try {
        //         const url = `http://localhost:3000/traceroute?ip=${this.host}`
        //         const response = await fetch(url);
        //         const data = await response.json();
        //         this.tracerouteResult = data.hops;
        //     } catch (error) {
        //         console.error('Traceroute test failed', error);
        //     }
        // },
    },
};
</script>

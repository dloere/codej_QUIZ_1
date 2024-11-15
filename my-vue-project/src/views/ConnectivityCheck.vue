<template>
    <div>
        <h2>Connectivity Checker</h2>

        <div style="height: 150px; border:1px solid; overflow: auto;">
            <h1>도움말</h1>
            <div>사용용도 : 서버가 실제로 종료되었는지 아니면 Ping을 차단한 건지 Check</div> 
            <div></div>
            <div>Method가 Ping이면 Ping이 정상적으로 가는것, axios라면 Ping이 안되어 axios 시도를 했다는 것</div> 
            <div>Status는 axios의 경우 200이면 성공 아니면 실패</div> 
        </div>

        <input v-model="address" placeholder="Enter IP or Domain" />
        <button @click="checkConnectivity" :disabled="loading">Check Connectivity</button>
        
        <div v-if="loading">Checking...</div>

        <div v-if="result">
        <p>Method: {{ result.method }}</p>
        <p>Reachable: {{ result.reachable }}</p>
        <p>Status: {{ result.status }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
        address: '', // 사용자로부터 받은 IP 또는 도메인
        result: null, // 연결 결과
        loading: false // 로딩 상태
        };
    },
    methods: {
        async checkConnectivity() {
            this.loading = true;
            this.result = null;

            try {
                const response = await axios.post('http://localhost:3000/check-connectivity', {
                address: this.address
                });
                this.result = response.data; // 결과를 저장
            } catch (error) {
                this.result = { method: 'error', reachable: false, status: error.message };
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
input {
    padding: 8px;
    margin-right: 10px;
}
button {
    padding: 8px 12px;
}
</style>

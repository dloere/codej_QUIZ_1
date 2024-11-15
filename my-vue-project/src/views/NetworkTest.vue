<template>
  <div>
    <h3>Network Tester</h3>

    <div style="height: 150px; border:1px solid; overflow: auto;">
      <h1>도움말</h1>
      <div>목표 : 현재 연결이 어디서 문제가 발생했는지 기본적인 테스트 진행</div> 
      <div>랜카드 - router - 인터넷연결의 기본적인 연결 상태를 확인한다.</div>
      <div>공유기 마다 게이트웨이가 다른데 현재 PC의 기본 게이트웨이를 자동으로 탐색한다.</div> 
    </div>

    <div>
      <button @click="startPingTest" :disabled="loading">
        Run Ping Test
      </button>
      <div v-if="loading">Loading...</div>
    </div>

    <div v-if="pingResults.length">
      <h4>Results</h4>
      <ul>
        <li v-for="(result, index) in pingResults" :key="index" :style="getResultStyle(result)">
          {{ result.name }}: {{ result.status }} (Time: {{ result.time }} ms)
        </li>
      </ul>
    </div>

    <div v-if="routerIP">
      <p>Router IP: {{ routerIP }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      pingResults: [],
      localIP: '127.0.0.1',
      routerIP: '', // 공유기 IP를 동적으로 받아옴
      websiteURL: '8.8.8.8'
    };
  },
  methods: {
    // Ping 테스트를 순차적으로 실행하는 함수
    async startPingTest() {
      this.loading = true;
      this.pingResults = [];

      // 공유기 IP 받아오기
      await this.getRouterIP();

      // 1. 로컬 네트워크 카드 테스트
      await this.testPing(this.localIP, '랜카드');

      // 2. 공유기 테스트
      if (this.routerIP) {
        await this.testPing(this.routerIP, 'Router(=기본 게이트웨이) 연결');
      }

      // 3. 인터넷 테스트
      await this.testPing(this.websiteURL, '구글 DNS 서버');

      this.loading = false;
    },

    // 공유기 IP 가져오기
    async getRouterIP() {
      try {
        const response = await fetch('http://localhost:3000/get-router-ip');
        const data = await response.json();
        if (data.routerIP) {
          this.routerIP = data.routerIP;
        }
      } catch (error) {
        console.error('Failed to get router IP', error);
      }
    },

    // Ping 요청 함수
    async testPing(ip, name) {
      try {
        const response = await fetch(`http://localhost:3000/ping?ip=${ip}`);
        const data = await response.json();

        if (data.ipStatus) {
          this.pingResults.push({
            name: name,
            status: '정상',
            time: data.time
          });
        } else {
          this.pingResults.push({
            name: name,
            status: '비정상',
            time: '-'
          });
        }
      } catch (error) {
        this.pingResults.push({
          name: name,
          status: 'Error',
          time: '-'
        });
        console.error('Ping error:', error);
      }
    },

    // 결과에 색상 스타일을 적용하는 함수
    getResultStyle(result) {
      if (result.status === '정상') {
        return { color: 'green' };
      } else if (result.status === '비정상') {
        return { color: 'red' };
      } else {
        return { color: 'gray' };
      }
    }
  }
};
</script>

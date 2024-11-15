<template>
  <div>
    <h3>Ping Service</h3>

    <div style="height: 200px; border:1px solid; overflow: auto;">
      <h1>도움말</h1>
      <div>사용용도 : Ping, PORT를 테스트한다.</div> 
      <div>부가기능 1. 테스트 결과를 캐시에 기록해두어 쉽게 다시 테스트 할 수 있다</div> 
      <div>부가기능 2. Ping만 되는지 Port도 되는지 구별하여 파악가능하다</div> 
      <div></div> 
    </div>

    <div style="display:flex; width: 100%">
      <div style="width: 500px">
        <!-- IP 입력창 -->
        <input v-model="ip" placeholder="Enter IP Address" />
        <input v-model="port" placeholder="Enter Port (Optional)" type="number" />
        <button @click="sendPing" :disabled="loading">Ping</button>
        
        <!-- 로딩 표시 -->
        <div v-if="loading">Loading...</div>

        <!-- 결과 표시 -->
        <div v-if="pingResult">
          <p>{{ pingResult }}</p>
        </div>
      </div>

      <div style="width: 300px; height:300px; overflow: auto">
        <h3>History</h3>
        <!-- 검색 이력 -->
        <div v-if="history.length">
          <ul>
            <li v-for="(item, index) in history" :key="index" >
              <span :style="{ color: item.ipStatus ? 'green' : 'red' }">{{ item.ip }}</span>
              <span v-if="item.port" :style="{ color: item.portStatus ? 'green' : 'red' }">:{{ item.port }}</span>
              <button @click="deleteHistory(index)">X</button> <!-- X 버튼 추가 -->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PingService',
  data() {
    return {
      ip: "",  // 현재 입력한 IP 주소
      port: "",  // 포트 입력값
      pingResult: null,  // ping 결과
      loading: false,  // 로딩 상태
      history: []  // 검색 이력
    };
  },
  methods: {
    // ping 요청 함수
    async sendPing() {
      if (!this.ip) {
        alert("Please enter a valid IP address.");
        return;
      }

      this.loading = true;  // 로딩 시작
      this.pingResult = null;  // 이전 결과 초기화

      try {
        // 포트가 입력되었을 경우 URL에 포함
        const url = this.port
          ? `http://localhost:3000/ping?ip=${this.ip}&port=${this.port}`
          : `http://localhost:3000/ping?ip=${this.ip}`;
        
        const response = await fetch(url);
        const data = await response.json();

        this.pingResult = data.message;  // 결과 메시지 표시

        // 이력에 성공/실패 색상 추가
        const ipStatus = data.ipStatus;
        const portStatus = data.portStatus;

        
        this.addToHistory(this.ip, this.port, ipStatus, portStatus);  // 이력에 IP, 포트, 색상 추가
      } catch (error) {
        this.pingResult = "Error: Unable to ping the IP.";
        console.error(error);
        this.addToHistory(this.ip, this.port, false, false);  // 이력에 추가
      } finally {
        this.loading = false;  // 로딩 종료
      }
    },

    // 이력에 IP, port, statusColor를 함께 추가하는 함수
    addToHistory(ip, port, ipStatus, portStatus) {
      // 같은 IP와 포트 조합이 이미 있으면 추가하지 않음
      const existingEntry = this.history.find(item => item.ip === ip && item.port === port);
      if (!existingEntry) {
        this.history.push({ ip, port, ipStatus, portStatus });
        this.updateLocalStorage();  // 이력 저장 시 로컬 스토리지 업데이트
      }
    },

    // 검색 이력 클릭 시 해당 IP와 포트로 ping을 다시 보내는 함수
    repeatPing(item) {
      this.ip = item.ip;  // IP를 입력창에 채우고
      this.port = item.port || '';  // 포트를 입력창에 채우고
      this.sendPing();  // ping을 다시 보냄
    },

    // 로컬 스토리지에 이력 저장
    updateLocalStorage() {
      // 이력을 로컬 스토리지에 저장
      localStorage.setItem('pingHistory', JSON.stringify(this.history));
    },

    // 로컬 스토리지에서 이력 불러오기
    loadHistoryFromLocalStorage() {
      const savedHistory = JSON.parse(localStorage.getItem('pingHistory') || '[]');
      this.history = savedHistory;
    },

    // 검색 이력 삭제 함수
    deleteHistory(index) {
      this.history.splice(index, 1);  // 해당 인덱스의 이력 삭제
      this.updateLocalStorage();  // 삭제 후 로컬 스토리지 업데이트
    }
  },
  mounted() {
    // 페이지가 로드될 때 로컬 스토리지에서 이력 불러오기
    this.loadHistoryFromLocalStorage();
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
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  background-color: #ccc;
}
/* div {
  margin-top: 20px;
} */
ul {
  list-style-type: none;
  padding: 0;
}
li {
  cursor: pointer;
  margin: 5px 0;
  background-color: #f1f1f1;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
}
li:hover {
  background-color: #e0e0e0;
}
button {
  cursor: pointer;
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
}
button:hover {
  background-color: #e60000;
}
</style>

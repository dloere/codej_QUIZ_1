<template>
  <div class="app-layout">
    <nav class="sidebar">
      <ul>
        <!-- children 배열을 사용하여 자동으로 링크를 생성 -->
        <li v-for="route in childRoutes" :key="route.path">
          <router-link :to="`/layout/${route.path}`" active-class="active">
            {{ route.name || route.path }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
// router 설정을 import 합니다.
import { useRoute } from 'vue-router';

export default {
  name: 'AppLayout',
  computed: {
    // '/layout' 경로 아래의 children만 가져오기
    childRoutes() {
      const route = useRoute();
      // '/layout' 아래에 있는 자식 route만 가져옴
      const layoutRoute = route.matched.find(r => r.path === '/layout');
      return layoutRoute ? layoutRoute.children : [];
    },
  },
};
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 20px 0;
}

.sidebar li a {
  text-decoration: none;
  color: white;
  font-size: 18px;
  padding: 10px;
  display: block;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.sidebar li a:hover {
  background-color: #34495e;
}

.sidebar li a.active {
  background-color: #1abc9c;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #ecf0f1;
}
</style>

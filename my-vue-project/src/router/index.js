import { createRouter, createWebHistory } from 'vue-router';
// import layout from '@/component/layout.vue'
// import PingService from '@/views/PingService.vue';
// import NetworkTest from '@/views/NetworkTest.vue';
// import ConnectivityCheck from '@/views/ConnectivityCheck.vue';
// import SpeedTester from '@/views/SpeedTester.vue';

const routes = [
    {
        path: '/layout',
        component: () => import('@/component/layout.vue'),
        redirect: '/layout/PingService',
        children: [
            {
                path: 'PingService',
                name: '핑, 포트 테스트',
                component: () => import('@/views/PingService.vue')
            },
            {
                path: 'NetworkTest',
                name: '네트워크 자가 진단',
                component: () => import('@/views/NetworkTest.vue')
            },
            {
                path: 'ConnectivityCheck',
                name: '사이트 연결 상태 체크',
                component: () => import('@/views/ConnectivityCheck.vue')
            },
            {
                path: 'SpeedTester',
                name: '속도 테스트',
                component: () => import('@/views/SpeedTester.vue')
            },
            {
                path: 'ServerMonitoring',
                name: '서버 모니터링',
                component: () => import('@/views/ServerMonitoring.vue')
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
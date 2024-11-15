import { createRouter, createWebHistory } from 'vue-router';
import layout from '@/component/layout.vue'
import PingService from '@/views/PingService.vue';
import NetworkTest from '@/views/NetworkTest.vue';
import ConnectivityCheck from '@/views/ConnectivityCheck.vue';
import SpeedTester from '@/views/SpeedTester.vue';

const routes = [
    {
        path: '/layout',
        component: layout,
        redirect: '/layout/PingService',
        children: [
            {
                path: 'PingService',
                name: '핑, 포트 테스트',
                component: PingService
            },
            {
                path: 'NetworkTest',
                name: '네트워크 자가 진단',
                component: NetworkTest
            },
            {
                path: 'ConnectivityCheck',
                name: '사이트 연결 상태 체크',
                component: ConnectivityCheck
            },
            {
                path: 'SpeedTester',
                name: '속도 테스트',
                component: SpeedTester
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
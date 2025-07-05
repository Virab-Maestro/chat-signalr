import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes = [
    {
        path: '/',
        redirect: '/chat',
    },

    {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/Chat.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
import {index} from "./index.js";
import {login} from "./login.js";
import {signup} from "./signup.js";
import {notFound} from "./notFound.js";

const routes = [
    {path: '/', component: index, meta: {requiresAuth: true}},
    {path: '/login', component: login},
    {path: '/signup', component: signup},
    {path: '*', component: notFound}
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!localStorage.getItem('access_token')) {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        } else {
            next();
        }
    } else {
        next();
    }
})

const app = new Vue({
    router
}).$mount('#app');
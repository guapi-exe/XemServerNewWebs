import { createRouter, createWebHistory } from 'vue-router'
import News from '../src/static/views/newsView.vue'
import Login from '../src/static/views/loginView.vue'
import Register from '../src/static/views/registerView.vue'
import Profile from '../src/static/views/profileView.vue'
import Map from '../src/static/views/mapView.vue'
import Mod from '../src/static/views/modView.vue'
import Schematic from '../src/static/views/schematicView.vue'
import ServerStatus from '../src/static/views/serverStatusView.vue'
import AboutSite from '../src/static/views/adoutSite.vue'
import webManage from '../src/static/views/webManageView.vue'

const routes = [
    {
        path: '/',
        name: 'index',
        redirect:"",
        component: News
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/map',
        name: 'MapSite',
        component: Map
    },
    {
        path: '/mod',
        name: 'ModSite',
        component: Mod
    },
    {
        path: '/schematic',
        name: 'SchematicSite',
        component: Schematic
    },
    {
        path: '/serverStatus',
        name: 'serverStatus',
        component: ServerStatus
    },
    {
        path: '/aboutSite',
        name: 'aboutSite',
        component: AboutSite
    }
    ,
    {
        path: '/webManage',
        name: 'webManage',
        component: webManage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
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
import gameAccount from '../src/static/views/gameAccountView.vue'
import adminCommand from '../src/static/views/AdminCommandView.vue'

const routes = [
    {
        path: '/',
        name: 'index',
        redirect:"",
        meta: {
            title: 'Home',
            description: 'XEM像素工厂服务器qq群765838631',
            keywords: 'mindustry, 像素工厂, 像素工厂服务器'
        },
        component: News
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
            description: 'XEM像素工厂服务器qq群765838631',
            keywords: 'mindustry, 像素工厂, 像素工厂服务器'
        },
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        meta: {
            title: '注册',
            description: 'XEM像素工厂服务器qq群765838631',
            keywords: 'mindustry, 像素工厂, 像素工厂服务器'
        },
        component: Register
    },
    {
        path: '/profile',
        name: 'Profile',
        meta: {
            title: '个人信息',
            description: 'XEM像素工厂服务器qq群765838631',
            keywords: 'mindustry, 像素工厂, 像素工厂服务器'
        },
        component: Profile
    },
    {
        path: '/map',
        name: 'MapSite',
        meta: {
            title: '地图站',
            description: 'XEM像素工厂服务器qq群765838631',
        },
        component: Map
    },
    {
        path: '/mod',
        name: 'ModSite',
        meta: {
            title: 'mod站',
            description: 'XEM像素工厂服务器qq群765838631',
        },
        component: Mod
    },
    {
        path: '/schematic',
        name: 'SchematicSite',
        meta: {
            title: '蓝图站',
            description: 'XEM像素工厂服务器qq群765838631',
            keywords: 'mindustry, 像素工厂, 像素工厂服务器, 像素工厂蓝图站, mindustry 蓝图'
        },
        component: Schematic
    },
    {
        path: '/serverStatus',
        name: 'serverStatus',
        meta: {
            title: '服务器状态',
            description: 'XEM像素工厂服务器qq群765838631, 服务器状态',
            keywords: 'mindustry, 像素工厂, 像素工厂服务器, '
        },
        component: ServerStatus
    },
    {
        path: '/aboutSite',
        name: 'aboutSite',
        meta: {
            title: '关于本站',
            description: 'XEM像素工厂关于本站',
            keywords: 'mindustry, 像素工厂, 像素工厂服务器'
        },
        component: AboutSite
    },
    {
        path: '/webManage',
        name: 'webManage',
        meta: {
            title: 'webManage',
            description: 'XEM像素工厂服务器qq群765838631',
        },
        component: webManage
    },
    {
        path: '/gameAccount',
        name: 'gameAccount',
        meta: {
            title: 'gameAccount',
            description: 'XEM像素工厂服务器qq群765838631',
        },
        component: gameAccount
    },
    {
        path: '/adminCommand',
        name: 'adminCommand',
        meta: {
            title: 'adminCommand',
            description: 'XEM像素工厂服务器qq群765838631',
        },
        component: adminCommand
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Default Title'
    const description = to.meta.description || 'Default Description'
    const keywords = to.meta.keywords || 'default, keywords'

    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
        metaDescription.setAttribute('content', description)
    } else {
        metaDescription = document.createElement('meta')
        metaDescription.name = 'description'
        metaDescription.content = description
        document.head.appendChild(metaDescription)
    }

    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords)
    } else {
        metaKeywords = document.createElement('meta')
        metaKeywords.name = 'keywords'
        metaKeywords.content = keywords
        document.head.appendChild(metaKeywords)
    }

    next()
})

export default router
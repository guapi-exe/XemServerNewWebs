
<template >
    <div id="app" ref="body">
        <el-container style="height: 100vh;position: fixed;width: 100%">
            <el-aside
                    v-if="aside"
                    type="flex"
                    style="width: fit-content;"
                    @mouseover="isCollapse = false"
                    @mouseleave="isCollapse = true"
            >

                <el-menu
                        default-active="2"
                        :collapse="table"
                        style="height: 100%"
                        class="cord-body"
                        expand-close-icon
                        expand-open-icon
                        :close-on-click-outside="true"
                >
                    <el-row>
                        <el-col
                                v-if="table"
                        >
                            <el-icon size="25" @click="table = false" ><Expand /></el-icon>
                        </el-col>
                        <el-col
                                v-if="!table"
                        >
                            <el-icon size="25" @click="table = true" ><Fold /></el-icon>
                        </el-col>
                    </el-row>

                    <el-menu-item index="1" @click="router.push('/')">
                        <el-icon><location /></el-icon>
                        <template #title>
                            <el-text size="large" >首页</el-text>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="2" @click="router.push('/mod')">
                        <el-icon><location /></el-icon>
                        <template #title>
                            <el-text size="large">mod站</el-text>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="4" @click="router.push('/schematic')">
                        <el-icon><location /></el-icon>
                        <template #title>
                            <el-text size="large">蓝图站</el-text>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="5" @click="router.push('/serverStatus')">
                        <el-icon><location /></el-icon>
                        <template #title>
                            <el-text size="large">服务器状态</el-text>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="6" @click="router.push('/aboutSite')">
                        <el-icon><location /></el-icon>
                        <template #title>
                            <el-text size="large">关于本站</el-text>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="10" @click="dialog = true">
                        <el-icon><location /></el-icon>
                        <template #title>
                            <el-text size="large">管理员登录</el-text>
                        </template>

                        <el-dialog v-model="dialog"
                                   title="登录"
                                   direction="ltr"
                                   :show-close="false"
                                   height="30%"
                                   :inputmode="true"
                                   v-loading="loading">
                            <div class="demo-drawer__content">
                                <el-form :model="loginFormData" ref="loginForm">
                                    <el-form-item label="用户" :label-width="60">
                                        <el-input v-model="loginFormData.name" placeholder="请输入用户名"/>
                                    </el-form-item>

                                    <el-form-item label="密码" :label-width="60">
                                        <el-input
                                                v-model="loginFormData.password"
                                                type="password"
                                                placeholder="请输入密码"
                                                show-password
                                        />
                                    </el-form-item>
                                </el-form>
                                <el-button type="primary" :loading="loading" @click="loading = true;siteMangeLogin()">{{
                                        loading ? '登录 ...' : '登录'
                                    }}</el-button>
                            </div>
                        </el-dialog>

                    </el-menu-item>
                    <el-sub-menu :disabled="!(Authority > 0)">
                        <template #title>
                            <el-icon><location /></el-icon>
                            <el-text size="large">服务器管理</el-text>
                        </template>
                        <el-menu-item index="7" @click="router.push('/webManage')">
                            <el-icon><location /></el-icon>
                            <template #title>
                                <el-text size="large">网站用户管理</el-text>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="8" @click="router.push('/aboutSite')">
                            <el-icon><location /></el-icon>
                            <template #title>
                                <el-text size="large">玩家用户管理</el-text>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="9" @click="router.push('/aboutSite')">
                            <el-icon><location /></el-icon>
                            <template #title>
                                <el-text size="large">Claj房间管理</el-text>
                            </template>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>

            </el-aside>
            <el-container>
                <el-header>
                    <el-menu
                            :router="true"
                            mode="horizontal"
                            :ellipsis="false"
                            class="cord-body"
                            width="100%"
                    >
                        <el-row v-if="small">
                            <el-col
                                    v-if="table"
                            >
                                <el-icon size="25" @click="table = false;aside = true" ><Expand /></el-icon>
                            </el-col>
                            <el-col
                                    v-if="!table"
                            >
                                <el-icon size="25" @click="table = true;aside = false"  ><Fold /></el-icon>
                            </el-col>
                        </el-row>
                        <div class="flex-grow" style="flex-grow: 1;"/>
                        <el-menu-item v-if="login">
                            <el-avatar @click="togglePopup" :src="avatar"></el-avatar>
                            <el-sub-menu>
                                <el-menu-item v-if="login" index="10" @click="logOut()"><el-text size="large" type="danger">登出</el-text></el-menu-item>
                                <el-menu-item v-if="login" index="11" @click="router.push('/profile')"><el-text size="large" type="primary">个人信息</el-text></el-menu-item>

                            </el-sub-menu>
                        </el-menu-item>
                        <el-menu-item v-if="!login" index="10" @click="router.push('/register')"><el-text size="large" type="primary">注册</el-text></el-menu-item>
                        <el-menu-item v-if="!login" index="11" @click="router.push('/login')">
                            <el-text size="large" type="primary">登录</el-text>
                        </el-menu-item>
                    </el-menu>
                </el-header>
                <el-main>
                    <router-view/>
                </el-main>
                <el-footer></el-footer>
            </el-container>
        </el-container>
    </div>

</template>



<style lang="css">
.cord-body [aside] {
    background: rgba(255, 255, 255, 0.65);
    padding: 12px;
    height: 100%;
}
body {
    width: 100%;
    min-height: 100vh;
    background: url("./static/img/Fyf7y09acAAHxyb.jpg") center center no-repeat;
    background-size: cover;
}

</style>

<script lang="ts" setup>
import {ElMessage} from "element-plus";
import {onMounted, ref} from 'vue'
import {Location,Expand,Fold} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import {ElDialog} from "element-plus";
import axios from "axios";
import {reactive} from "vue";
const router = useRouter()
const isCollapse = ref(true)
const loading = ref(false)
let table = ref(false)
const aside = ref(true)
const dialog = ref(false)
const small = ref(false)
const login = ref(false)
const showPopup = ref(false)
const avatar = ref("")
const body = ref(null);
const Authority = ref(0)

let loginFormData = reactive({
    name: '',
    password: '',
})

onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize);
    axios.get('https://new.xem8k5.top:1080/api/getUseAuthority')
            .then(response => {
                Authority.value = Number(response.data)
            })
            .catch((error) => {
                ElMessage({
                    message: "发生错误：" + error.response.data,
                    type: "error",
                    grouping: true
                })
            })
    axios.get('https://new.xem8k5.top:1080/api/loginStatus')
            .then(response => {
                const status = response.data.status;
                if (typeof status === 'boolean') {
                    login.value = status.toString() === "true";
                } else {
                    console.log('get return err' + status);
                }
            })
            .catch(error => {
                console.error('请求出错:', error);
                ElMessage({
                    message: "发生错误：" + error,
                    type: "error",
                    grouping: true
                })
            });
    axios.get('/avatar')
            .then(response => {
                avatar.value = response.data
            })
            .catch(error =>{
                ElMessage({
                    message: "发生错误：" + error,
                    type: "error",
                    grouping: true
                })
            })
})
const logOut= ()=>{
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
    location.reload()
}

const togglePopup = () => {
    showPopup.value = !showPopup.value;
}

const handleResize=() => {
    const element:any = body.value;
    const elementWidth: number = element?.clientWidth;
    if (elementWidth <= 800) {
        table.value = true;
        aside.value = false;
        small.value = true;
    }
    if (elementWidth >= 800){
        table.value = false;
        aside.value = true;
        small.value = false
    }
}

const siteMangeLogin=()=>{
    if(loginFormData.name.length > 0 && loginFormData.password.length > 0){
        const credentials = {
            name: loginFormData.name,
            protectKey: loginFormData.password
        };
        const jsonCredentials = JSON.stringify(credentials);
        const base64Credentials = btoa(jsonCredentials);
        const loginPacket = {
            base64: base64Credentials
        };
        axios.post('https://new.xem8k5.top:1080/siteManageLogin', loginPacket, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
                .then(response => {
                    const data = response.data;
                    if (data.status === '登录成功') {
                        ElMessage({
                            message: "登录成功",
                            type: "success"
                        })
                        const currentDate = new Date();
                        const expirationDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                        const expirationDateString = expirationDate.toUTCString();
                        const cookieData = JSON.parse(data.cookie);
                        document.cookie = `uuid=${cookieData.uuid}; expires=${expirationDateString}; path=/`;
                        document.cookie = `protectKey=${cookieData.protectKey}; expires=${expirationDateString}; path=/`;
                        loading.value = false
                        dialog.value = false;
                    } else {
                        ElMessage({
                            message: data.status,
                            type: "error"
                        })
                        loading.value = false
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    ElMessage({
                        message: "发生错误：" + error,
                        type: "error"
                    })
                    loading.value = false
                });
    }
}

</script>
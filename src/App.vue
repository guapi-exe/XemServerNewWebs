<template>
  <div id="app">
    <el-container>
      <el-header height="50px" style="text-align: right">
        <el-menu :router="true" mode="horizontal" :ellipsis="false">
          <el-menu-item index="1" @click="router.push('/')"><el-text size="large" type="primary">首页</el-text></el-menu-item>
          <el-menu-item index="2" @click="router.push('/mod')"><el-text size="large" type="info">mod站</el-text></el-menu-item>
          <div class="flex-grow" style="flex-grow: 1;"/>
          <el-menu-item v-if="login">
            <div class="avatar-container">
              <el-avatar @click="togglePopup"> baka </el-avatar>
              <transition name="slide-fade">
                <div class="options-popup" v-if="showPopup">
                  <el-menu-item v-if="login" index="10" @click="logOut()"><el-text size="large" type="danger">登出</el-text></el-menu-item>
                  <el-menu-item v-if="login" index="11" @click="router.push('/profile')"><el-text size="large" type="primary">个人信息</el-text></el-menu-item>
                </div>
              </transition>
            </div>
          </el-menu-item>
          <el-menu-item v-if="!login" index="10" @click="router.push('/register')"><el-text size="large" type="primary">注册</el-text></el-menu-item>
          <el-menu-item v-if="!login" index="11" @click="Login.data().dialog = true;router.push('/login')">
            <el-text size="large" type="primary">登录</el-text>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <el-scrollbar height="730px">
          <router-view/>
        </el-scrollbar>
      </el-main>
      <el-footer height="50px" style="text-align: right">
        <el-space direction="vertical" wrap alignment="start">
          <el-text size="small">
            梦魔短祷 2023
          </el-text>
          <el-text size="small">
            Designed with <el-icon><element-plus/></el-icon>Element-Plus
          </el-text>
        </el-space>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
/* eslint-disable */
import { useRouter } from "vue-router";
import {ElementPlus} from '@element-plus/icons-vue'
import Login from './static/views/loginView.vue'
import VueClipboard from 'vue-clipboard2'



const router = useRouter()
router.push('/')
</script>
<script>
import {ElMessage} from "element-plus";
import axios from "axios";
export default {
  data() {
    return {
      login: false,
      showPopup: false,
    }
  },
  mounted() {
    axios.get('/api/loginStatus')
        .then(response => {
          const status = response.data.status;
          if (typeof status === 'boolean') {
            this.login = status.toString() === "true";
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
  },

  methods:{
    logOut(){
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      }
      location.reload()
    },
    togglePopup() {
      this.showPopup = !this.showPopup;
    }
  }
}

</script>
<style lang="css">
body {
    background-image: url("./static/img/Fyf7y09acAAHxyb.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
.demo-type {
  display: flex;
}
.demo-type > div {
  flex: 1;
  text-align: center;
}

.demo-type > div:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
.avatar-container {
  position: relative;
}

.options-popup {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 100;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.options-popup ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.options-popup li {
  padding: 8px 12px;
  cursor: pointer;
}

.options-popup:hover {
  background-color: #f7f7f7;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
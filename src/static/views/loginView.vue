<template>
  <el-form ref="loginForm" :model="loginForm" :rules="loginForm" label-width="150px">
    <el-form-item label="请输入邮箱" prop="email">
      <el-input v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="请输入密码" prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="remember">记住账号</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import {ElDrawer, ElMessage} from "element-plus";
export default {

  components: {ElDrawer},
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      remember: false,
      loginRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.retrieveRememberedCredentials();
  },
  methods: {
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const { email, password } = this.loginForm;
          const credentials = {
            email: email,
            password: password
          };
          const jsonCredentials = JSON.stringify(credentials);
          const base64Credentials = btoa(jsonCredentials);
          const loginPacket = {
            base64: base64Credentials
          };

          if (this.remember) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
          } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
          }

          axios.post('https://new.xem8k5.top:1080/login', loginPacket, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
              .then(response => {
                this.rememberCredentials()
                const data = response.data;
                if (data.status === '登录成功') {
                  ElMessage({
                    message: "登录成功，正在跳转至首页",
                    type: "success"
                  })
                  const currentDate = new Date();
                  const expirationDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                  const expirationDateString = expirationDate.toUTCString();
                  const cookieData = JSON.parse(data.cookie);
                  document.cookie = `email=${cookieData.email}; expires=${expirationDateString}; path=/`;
                  document.cookie = `secret=${cookieData.secret}; expires=${expirationDateString}; path=/`;
                  window.location.href = '/';
                } else {
                  ElMessage({
                    message: data.status,
                    type: "error"
                  })
                }
              })
              .catch(error => {
                console.error('Error:', error);
                ElMessage({
                  message: "发生错误：" + error,
                  type: "error"
                })
              });

        } else {
          return false;
        }
      });
    },
    retrieveRememberedCredentials() {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      const rememberedPassword = localStorage.getItem('rememberedPassword');
      if (rememberedEmail && rememberedPassword) {
        this.loginForm.email = rememberedEmail;
        this.loginForm.password = rememberedPassword;
        this.remember = true;
      }
    },
    rememberCredentials() {
      if (this.remember){
        localStorage.setItem('rememberedEmail', this.loginForm.email);
        localStorage.setItem('rememberedPassword', this.loginForm.password);
      }
    }
  }

}

</script>
<template>
  <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="150px">
    <el-form-item label="请输入邮箱" prop="email">
      <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="请输入密码" prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="请确认密码" prop="passwordConfirm">
      <el-input v-model="registerForm.passwordConfirm" type="password" placeholder="请确认密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="remember">记住账号</el-checkbox>
    </el-form-item>
    <el-form-item label="请输入验证码" prop="verificationCode">
      <el-space direction="vertical" wrap alignment="start" style="height: 80px">
        <el-button v-if="percentage === 0" :disabled="percentage !== 0" type="primary" @click="getCode()" style="height: 30px;">获取验证码</el-button>
        <el-progress v-if="percentage !== 0" :percentage="percentage" :format="() => text" style="margin-bottom: 15px;width: 350px;height: 20px;"/>
        <el-input v-model="registerForm.verificationCode" placeholder="请输入验证码" style="position: absolute; bottom: 0;"></el-input>
      </el-space>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="register()">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      registerForm: {
        email: '',
        password: '',
        passwordConfirm: '',
        verificationCode: ''
      },
      registerRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        passwordConfirm: [
          {required: true, message: '请确认密码', trigger: 'blur'}
        ],
        verificationCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      },
      remember: false,
      percentage: 0,
      text: ""
    };
  },
  mounted() {
    this.retrieveRememberedCredentials();
  },
  methods: {
    getCode() {
      const email = this.registerForm.email
      if (email === "") {
        ElMessage({
          message: "请输入邮箱",
          type: "warning"
        })
      } else {
        const credentials = {
          type: 1,
          email: email,
          password: "",
          code: 0
        };

        const jsonCredentials = JSON.stringify(credentials);
        const base64Credentials = btoa(jsonCredentials);
        const codeRequestPacket = {
          base64: base64Credentials
        };

        axios.post('https://new.xem8k5.top:1080/register', codeRequestPacket, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
            .then(response => {
              this.rememberCredentials()
              const data = response.data;
              if (data.status === '已发送') {
                ElMessage({
                  message: "验证码已发送至您的邮箱，请注意查收",
                  type: "warning"
                })
                this.startCountdown();
              } else {
                alert(data.status);
              }
            })
            .catch(error => {
              console.error('Error:', error);
              ElMessage({
                message: "发生错误：" + error,
                type: "error"
              })
            });

      }
    },
    register() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          const {email, password, passwordConfirm, verificationCode} = this.registerForm;

          if (password !== passwordConfirm) {
            ElMessage({
              message: "密码不一致",
              type: "error"
            })
            return;
          }

          const credentials = {
            type: 2,
            email: email,
            password: password,
            code: verificationCode
          };

          const jsonCredentials = JSON.stringify(credentials);
          const base64Credentials = btoa(jsonCredentials);
          const requestPacket = {base64: base64Credentials};

          axios.post(`https://new.xem8k5.top:1080/register`, requestPacket, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
              .then(response => {
                this.rememberCredentials()
                const data = response.data;
                if (data.status === "注册成功") {
                  ElMessage({
                    message: "注册成功，正在跳转至首页",
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
                  this.$message.error(data.status);
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
    startCountdown() {
      let totalTime = 60
      this.percentage = 100
      const interval = setInterval(() => {
        totalTime--;
        if (totalTime <= 0) {
          clearInterval(interval);
        }
        this.percentage = Math.floor((totalTime / 60) * 100);
        this.text = totalTime
      }, 1000);
    },
    retrieveRememberedCredentials() {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      const rememberedPassword = localStorage.getItem('rememberedPassword');
      if (rememberedEmail && rememberedPassword) {
        this.registerForm.email = rememberedEmail;
        this.registerForm.password = rememberedPassword;
        this.remember = true;
      }
    },
    rememberCredentials() {
      if (this.remember){
        localStorage.setItem('rememberedEmail', this.registerForm.email);
        localStorage.setItem('rememberedPassword', this.registerForm.password);
      }
    }
  }
}
</script>
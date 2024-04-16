<template>
  <el-space direction="vertical" wrap alignment="start">
    <el-text type="primary" size="large">{{ mail }}</el-text>
    <el-text><el-icon><loading/></el-icon> 经验： {{ exp }}/{{nextLevel}}</el-text>
    <el-text><el-icon><coin/></el-icon> 狱币： {{ coin }}</el-text>
    <el-text><el-icon><FullScreen/></el-icon> 魔晶： {{ crystal }}</el-text>
    <el-text/>
    <el-button v-if="bindPercentage === 0" :disabled="bindPercentage !== 0" type="primary" @click="getBindCode()" style="height: 20px;">获取绑定码</el-button>
    <el-text v-if="bindCode === 0" style="height: 15px;"> </el-text>
    <el-progress v-if="bindPercentage !== 0" :percentage="bindPercentage" :format="() => bindTime.toString()" style="width: 200px;height: 20px;"/>
    <el-text v-if="bindCode !== 0" style="height: 15px;">绑定码： {{ bindCode }}</el-text>
    <el-text/>
    <el-button v-if="qqBindPercentage === 0" :disabled="qqBindPercentage !== 0" type="primary" @click="getQQBindCode()" style="height: 20px;">获取qq机器人绑定码</el-button>
    <el-text v-if="bindCode === 0" style="height: 15px;"> </el-text>
    <el-progress v-if="qqBindPercentage !== 0" :percentage="qqBindPercentage" :format="() => qqBindTime.toString()" style="width: 200px;height: 20px;"/>
    <el-text v-if="qqBindCode !== 0" style="height: 15px;">qq机器人绑定码： {{ qqBindCode }}</el-text>
    <el-text/>
    <el-button v-if="guildBindPercentage === 0" :disabled="guildBindPercentage !== 0" type="primary" @click="getGuildBindCode()" style="height: 20px;">获取频道机器人绑定码</el-button>
    <el-text v-if="bindCode === 0" style="height: 15px;"> </el-text>
    <el-progress v-if="guildBindPercentage !== 0" :percentage="guildBindPercentage" :format="() => guildBindTime.toString()" style="width: 200px;height: 20px;"/>
    <el-text v-if="guildBindCode !== 0" style="height: 15px;">频道机器人绑定码： {{ guildBindCode }}</el-text>
  </el-space>
</template>

<script>
import {Coin, FullScreen, Loading} from "@element-plus/icons-vue";
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  components: {FullScreen, Loading, Coin},
  data() {
    return {
      qq: '',
      guild: '',
      mail: '',
      discord: '',
      phone: '',
      playTime: 0,
      level: 0,
      exp: 0,
      nextLevel: 0,
      coin: 0,
      crystal: 0,

      bindCode: 0,
      qqBindCode: 0,
      guildBindCode: 0,

      bindPercentage: 0,
      bindTime: 0,

      qqBindPercentage: 0,
      qqBindTime: 0,

      guildBindPercentage: 0,
      guildBindTime: 0,
    };
  },
  mounted() {
    axios.get('/api/profile')
        .then(response => {
          const data = response.data;

          this.qq = data.qq.toString()
          this.guild = data.guild.toString()
          this.mail = data.mail.toString()
          this.discord = data.discord.toString()
          this.phone = data.phone.toString()
          this.playTime = data.playTime.toString()
          this.level = data.level
          this.exp = data.exp
          this.nextLevel = data.nextLevel
          this.coin = data.coin
          this.crystal = data.crystal
        })
        .catch(error => {
          console.error('Error:', error);
          ElMessage({
            message: "发生错误：" + error,
            type: "error"
          })
        });
  },
  methods: {
    getBindCode() {
      axios.get('/api/bindServer')
          .then(response => {
            const data = response.data;
            this.bindCode = data.code;
            this.startBindCountdown();
          })
          .catch(error => {
            console.error('Error:', error);
            ElMessage({
              message: "发生错误：" + error,
              type: "error"
            })
          });
    },
    startBindCountdown() {
      this.bindTime = 60
      this.bindPercentage = 100
      const interval = setInterval(() => {
        this.bindTime--;
        if (this.bindTime <= 0) {
          clearInterval(interval);
        }
        this.bindPercentage = Math.floor((this.bindTime / 60) * 100);
        this.text = this.bindTime
      }, 1000);
    },
    getQQBindCode() {
      axios.get('/api/bindQQ')
          .then(response => {
            const data = response.data;
            this.qqBindCode = data.code;
            this.startQQBindCountdown();
          })
          .catch(error => {
            console.error('Error:', error);
            ElMessage({
              message: "发生错误：" + error,
              type: "error"
            })
          });
    },
    startQQBindCountdown() {
      this.qqBindTime = 60
      this.qqBindPercentage = 100
      const interval = setInterval(() => {
        this.qqBindTime--;
        if (this.qqBindTime <= 0) {
          clearInterval(interval);
        }
        this.qqBindPercentage = Math.floor((this.qqBindTime / 60) * 100);
        this.text = this.qqBindTime
      }, 1000);
    },
    getGuildBindCode() {
      axios.get('/api/bindGuild')
          .then(response => {
            const data = response.data;
            this.guildBindCode = data.code;
            this.startGuildBindCountdown();
          })
          .catch(error => {
            console.error('Error:', error);
            ElMessage({
              message: "发生错误：" + error,
              type: "error"
            })
          });
    },
    startGuildBindCountdown() {
      this.guildBindTime = 60
      this.guildBindPercentage = 100
      const interval = setInterval(() => {
        this.guildBindTime--;
        if (this.guildBindTime <= 0) {
          clearInterval(interval);
        }
        this.guildBindPercentage = Math.floor((this.guildBindTime / 60) * 100);
        this.text = this.guildBindTime
      }, 1000);
    },
  }
}
</script>
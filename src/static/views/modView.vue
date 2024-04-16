<template>
    <el-text>该站点目前已弃用</el-text>
  <el-upload
      v-if="login"
      drag
      action="https://new.xem8k5.top:1080/api/uploadMod"
      multiple
  >
    <el-icon class="el-icon--upload"><upload-filled/></el-icon>
  </el-upload>

  <el-row id="row" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-delay="1000">
    <mod-renderer v-for="(mod, index) in modData" :key="index" :data="mod"/>
    <p v-if="loading">正在加载</p>
    <p v-if="noMore">没有更多了</p>
  </el-row>
</template>

<script setup>
/* eslint-disable */
import { computed, ref } from 'vue'
import ModRenderer from "../units/modRenderer.vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {UploadFilled} from "@element-plus/icons-vue";

const page = ref(1)
const loading = ref(false)
const noMore = computed(() => page.value >= 200)
const disabled = computed(() => loading.value || noMore.value)

const modData = ref([]);

const load = () => {
  loading.value = true;

  axios.get('/api/mods?begin=' + page.value)
      .then((response) => {
        const jsonData = response.data;
        jsonData.forEach((mod) => {
          modData.value.push(mod);
        });
        loading.value = false;
        page.value += jsonData.size;
      })
      .catch(error => {
        console.error('Error:', error);
        ElMessage({
          message: "发生错误：" + error,
          type: "error"
        })
      });
};
</script>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      login: false
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
}
</script>

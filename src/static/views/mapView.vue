<template>
  <el-upload
      v-if="login"
      drag
      action="https://new.xem8k5.top:1080/api/uploadMap"
      multiple
  >
    <el-icon class="el-icon--upload"><upload-filled/></el-icon>
  </el-upload>

  <el-row id="row" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
    <map-renderer v-for="(map, index) in mapData" :key="index" :data="map"/>
    <p v-if="loading">正在加载</p>
    <p v-if="noMore">没有更多了</p>
  </el-row>
</template>

<script setup>
/* eslint-disable */
import { computed, ref } from 'vue'
import MapRenderer from "../units/mapRenderer.vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {UploadFilled} from "@element-plus/icons-vue";

const page = ref(1)
const loading = ref(false)
const noMore = computed(() => page.value >= 200)
const disabled = computed(() => loading.value || noMore.value)

const mapData = ref([]);

const load = () => {
  loading.value = true;

  axios.get('/api/maps?begin=' + page.value)
      .then((response) => {
        const jsonData = response.data;
        jsonData.forEach((map) => {
          mapData.value.push(map);
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

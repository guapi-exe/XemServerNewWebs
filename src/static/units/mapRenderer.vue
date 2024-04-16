<template>
  <el-col
      class="el-col-24 el-col-xs-24 el-col-sm-12 el-col-lg-6 is-guttered"
      style="padding-right: 8px; padding-left: 8px;"
  >
    <el-card shadow="always" mapCard style="height: 550px">
      <el-image :src="mapData.preview" fit="contain" style="height: 300px; width: 300px;image-rendering: pixelated;"/>
      <el-scrollbar style="height: 30px">
        <el-space direction="horizontal">
            <span v-for="tag in mapData.tags" :key="tag">
              <el-tag size="small">{{ tag }}</el-tag>
            </span>
        </el-space>
      </el-scrollbar>
      <el-scrollbar max-height="70px">
        <el-space direction="vertical">
          <el-text size="large" style="width: 100%">{{ mapData.name }}</el-text>
          <el-text style="margin-left: auto; white-space: pre-line; width: 100%">{{ mapData.desc }}</el-text>
        </el-space>
      </el-scrollbar>
      <el-divider/>
      <el-row justify="space-around" type="flex">
        <el-button link aria-disabled="false" @click="copyToClipboard(`/vote map ${mapData.id}`)">
          <svg aria-hidden="true" focusable="false" role="img" class="Octicon-sc-9kayk9-0 exTBfn" viewBox="0 0 16 16"
               width="16" height="16" fill="currentColor"
               style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;">
            <path
                d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM7.25 8a.749.749 0 0 1-.22.53l-2.25 2.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L5.44 8 3.72 6.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.25 2.25c.141.14.22.331.22.53Zm1.5 1.5h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5Z"></path>
          </svg>
        </el-button>
        <el-divider role="separator" direction="vertical"/>
        <el-button link aria-disabled="false" @click="downloadMap">
          <svg aria-hidden="true" focusable="false" role="img" class="octicon octicon-desktop-download"
               viewBox="0 0 16 16" width="16" height="16" fill="currentColor"
               style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;">
            <path
                d="m4.927 5.427 2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 5H8.75V.75a.75.75 0 1 0-1.5 0V5H5.104a.25.25 0 0 0-.177.427Z"></path>
            <path
                d="M1.573 2.573a.25.25 0 0 0-.073.177v7.5a.25.25 0 0 0 .25.25h12.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-3a.75.75 0 1 1 0-1.5h3A1.75 1.75 0 0 1 16 2.75v7.5A1.75 1.75 0 0 1 14.25 12h-3.727c.099 1.041.52 1.872 1.292 2.757A.75.75 0 0 1 11.25 16h-6.5a.75.75 0 0 1-.565-1.243c.772-.885 1.192-1.716 1.292-2.757H1.75A1.75 1.75 0 0 1 0 10.25v-7.5A1.75 1.75 0 0 1 1.75 1h3a.75.75 0 0 1 0 1.5h-3a.25.25 0 0 0-.177.073ZM6.982 12a5.72 5.72 0 0 1-.765 2.5h3.566a5.72 5.72 0 0 1-.765-2.5H6.982Z"></path>
          </svg>
        </el-button>
        <el-divider role="separator" direction="vertical"/>
        <el-button link>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor"
               style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"
               class="octicon octicon-eye mr-2">
            <path
                d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>
          </svg>
        </el-button>
      </el-row>
    </el-card>
  </el-col>
</template>

<script>
export default {
  props: {
    // 定义一个 prop 接收外部传入的 ID
    data: {
      type: JSON,
      required: true
    }
  },
  data() {
    return {
      mapData: {
        // 初始化地图数据
        id: this.data.id,
        name: this.data.name,
        desc: this.data.desc,
        preview: this.data.preview,
        tags: this.data.tags
      }
    };
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
          .then(() => {
            console.log('已复制到剪贴板:', text);
          })
          .catch(err => {
            console.error('复制到剪贴板失败:', err);
          });
    },
    downloadMap() {
      window.location.href = `/api/map?id=${this.mapData.id}`;
    }
  }
};
</script>


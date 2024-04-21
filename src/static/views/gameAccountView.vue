<template>
    <el-row>
        <el-col>
            <el-card class="cord-body">
                <div class="box-card-title-wrapper">
                    <div class="box-card-title">
                        <span class="left-tip"></span>
                        <el-text size="large">用户管理</el-text>
                    </div>
                </div>
                <el-row>
                    <el-col
                            :xs="{ span: 20}"
                            :sm="{ span: 12}"
                            :md="{ span: 12}"
                            :lg="{ span: 6}"
                    >
                        <el-autocomplete
                                v-model="input"
                                clearable
                                style="width: 98%;"
                                popper-class="my-autocomplete"
                                placeholder="搜索栏"
                        >

                        </el-autocomplete>

                    </el-col>

                    <el-col
                            :xs="{ span: 4}"
                            :sm="{ span: 4}"
                            :md="{ span: 4}"
                            :lg="{ span: 2}"
                    >
                        <el-button type="primary" @click="clearLoadUser()">
                            <el-icon><Search /></el-icon>
                            <el-text size="large">搜索</el-text>
                        </el-button>
                    </el-col>

                    <el-col
                            :xs="{ span: 24}"
                            :sm="{ span: 24}"
                            :md="{ span: 12,push:4}"
                            :lg="{ span: 8,push:12}"
                    >
                        <el-button-group>
                            <el-button type="success" @click="dialogM = true" :disabled="true">
                                <el-icon><Plus /></el-icon>
                                <el-text size="large">新建用户</el-text>
                            </el-button>
                            <el-button type="danger" :disabled="true">
                                <el-icon><DeleteFilled /></el-icon>
                                <el-text size="large">删除用户</el-text>
                            </el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row
                        v-infinite-scroll="loadUser"
                        :infinite-scroll-disabled="loading || noMore"
                        :infinite-scroll-delay="1000"
                >
                    <el-table v-if="!(dialogM || dialogE)"
                              :data="tableData"
                              style="width: 100%;overflow:auto"
                    >
                        <el-table-column label="id" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <el-icon><User /></el-icon>
                                    <span style="margin-left: 10px">{{ scope.row.id ? scope.row.id : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="exp" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.exp ? scope.row.exp : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="qq" width="180" >
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.qq ? scope.row.qq : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="邮箱" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.mail ? scope.row.mail : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="qq频道" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.qqChannel ? scope.row.qqChannel : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="discord" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.discord ? scope.row.discord : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="游玩时间" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.playTime ? scope.row.playTime : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="语言" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.lang ? scope.row.lang : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="育碧" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.coin ? scope.row.coin : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="钻石" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.crystal ? scope.row.crystal : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="注册时间" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.registerTime ? scope.row.registerTime : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="最后登录时间" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.lastTime ? scope.row.lastTime : "空"}}</span>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" fixed="right" width="140">
                            <template #default="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row);dialogE = true"
                                >编辑</el-button>

                                <el-button
                                        size="small"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)"
                                >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>

                </el-row>
            </el-card>

        </el-col>
    </el-row>
    <el-dialog v-model="dialogE"
               :title="'修改用户信息:'+editUserFormData.id"
               direction="ltr"
               :show-close="false"
               height="30%"
               :inputmode="true"
               v-loading="loadingE">
        <div class="demo-drawer__content">
            <el-form :model="editUserFormData" ref="loginForm">
                <el-form-item label="exp" :label-width="60">
                    <el-input v-model="editUserFormData.exp" placeholder="请输入exp"/>
                </el-form-item>
                <el-form-item label="育碧" :label-width="60">
                    <el-input v-model="editUserFormData.coin" placeholder="请输入育碧"/>
                </el-form-item>
                <el-form-item label="钻石" :label-width="60">
                    <el-input v-model="editUserFormData.crystal" placeholder="请输入钻石"/>
                </el-form-item>
                <el-form-item label="qq" :label-width="60">
                    <el-input v-model="editUserFormData.qq" placeholder="请输入qq"/>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="60">
                    <el-input v-model="editUserFormData.mail" placeholder="请输入邮箱"/>
                </el-form-item>
                <el-form-item label="qq频道" :label-width="60">
                    <el-input v-model="editUserFormData.qqChannel" placeholder="请输入qq频道"/>
                </el-form-item>
                <el-form-item label="discord" :label-width="60">
                    <el-input v-model="editUserFormData.discord" placeholder="请输入discord"/>
                </el-form-item>
                <el-form-item label="游玩时间" :label-width="60">
                    <el-input v-model="editUserFormData.playTime" placeholder="请输入游玩时间"/>
                </el-form-item>
                <el-form-item label="语言" :label-width="60">
                    <el-input v-model="editUserFormData.lang" placeholder="请输入语言"/>
                </el-form-item>


            </el-form>
            <el-button type="primary" :loading="loadingE" @click="loadingE = true;updateUser()">{{
                    loadingE ? '修改中 ...' : '修改用户信息'
                }}</el-button>
        </div>
    </el-dialog>
</template>

<style scoped lang="css">
.box-card-title {
    font-weight: 600;
    font-size: 14px;
}

.box-card-title-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}

.left-tip {
    display: inline-block;
    margin-right: 6px;
    margin-bottom: 2px;
    border-radius: 2px;
    color: #409eff;
    background-color: #409eff;
    height: 14px;
    width: 6px;
    vertical-align: middle;
}
</style>
<script setup lang="ts">
import { Search,Plus,DeleteFilled,User } from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {ElDialog, ElMessage} from "element-plus";
const dialogM = ref(false)
const loading = ref(false)
const dialogE = ref(false)
const loadingE = ref(false)
const noMore = ref(false)
const page = ref(0)

let editUserFormData = reactive({
    id: 0,
    exp:0,
    coin:0,
    crystal:0,
    qq : "",
    mail : "",
    qqChannel : "",
    discord : "",
    playTime : "",
    lang : "",
})

interface User {
    id: number,
    exp:number,
    coin:number,
    crystal:number,
    qq : string,
    mail : string,
    qqChannel : string,
    discord : string,
    playTime : string,
    lang : string,
    registerTime : string,
    lastTime : string,
}
const tableData = ref<User[]>([])
const input = ref("")
const handleEdit = (index: number, row: User) => {
    dialogE.value = true
    editUserFormData.id = row.id
    editUserFormData.exp = row.exp
    editUserFormData.coin = row.coin
    editUserFormData.crystal = row.crystal
    editUserFormData.qq = row.qq
    editUserFormData.mail = row.mail
    editUserFormData.qqChannel = row.qqChannel
    editUserFormData.discord = row.discord
    editUserFormData.playTime = row.playTime
    editUserFormData.lang = row.lang
    console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
    console.log(index, row)
}
const clearLoadUser=()=>{
    tableData.value = []
    page.value = 0
    loadUser()
}

onMounted(()=>{
    loading.value = true
    noMore.value = false;
    axios.get(`https://new.xem8k5.top:1080/api/getAccountInfo?filter=${input.value}&begin=${page.value}`)
            .then(response => {
                tableData.value.push(...response.data)
                const jsonData = response.data;
                loading.value = false
                if (jsonData.length === 0) {
                    noMore.value = true;
                    return;
                }
                page.value = jsonData[jsonData.length - 1]["id"] + 1;
            })
            .catch(error => {
                ElMessage.error(`发生错误：${error}`);
                loading.value = false
                noMore.value = true;
            })
})
const loadUser=()=>{
    loading.value = true
    noMore.value = false;
    axios.get(`https://new.xem8k5.top:1080/api/getAccountInfo?filter=${input.value}&begin=${page.value}`)
            .then(response => {
                tableData.value.push(...response.data)
                const jsonData = response.data;
                loading.value = false
                if (jsonData.length === 0) {
                    noMore.value = true;
                    return;
                }
                page.value = jsonData[jsonData.length - 1]["id"] + 1;
            })
            .catch(error => {
                ElMessage.error(`发生错误：${error}`);
                loading.value = false
                noMore.value = true;
            })
}


const updateUser=()=>{
    const credentials = {
        id: editUserFormData.id,
        exp:editUserFormData.exp,
        coin:editUserFormData.coin,
        crystal:editUserFormData.crystal,
        qq : editUserFormData.qq,
        mail : editUserFormData.mail,
        qqChannel : editUserFormData.qqChannel,
        discord : editUserFormData.discord,
        playTime : editUserFormData.playTime,
        lang : editUserFormData.lang,
    };
    const jsonCredentials = JSON.stringify(credentials);
    const base64Credentials = btoa(jsonCredentials);
    const loginPacket = {
        base64: base64Credentials
    };
    axios.post('https://new.xem8k5.top:1080/api/updatePlayerInfo', loginPacket, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
            .then(response => {
                const data = response.data;
                loadUser()
                ElMessage({
                    message: "OK"+data,
                    type: "success"
                })
                loadingE.value = false
                dialogE.value = false;
            })
            .catch(error => {
                ElMessage({
                    message: error.response.data,
                    type: "error"
                })
                loadingE.value = false
                dialogE.value = false;
            })
}
</script>

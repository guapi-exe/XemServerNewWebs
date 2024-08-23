<template>
    <el-row>
        <el-col>
            <el-card class="cord-body">
                <div class="box-card-title-wrapper">
                    <div class="box-card-title">
                        <span class="left-tip"></span>
                        <el-text size="large">封禁列表</el-text>
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
                                :disabled="true"
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
                        <el-button type="primary" @click="loadUser()">
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
                            <el-button type="success" @click="dialogM = true;">
                                <el-icon><Plus /></el-icon>
                                <el-text size="large">封禁用户</el-text>
                                <el-dialog v-model="dialogM"
                                           title="封禁用户"
                                           direction="ltr"
                                           :show-close="false"
                                           height="30%"
                                           :inputmode="true"
                                           v-loading="loadingM">
                                    <div class="demo-drawer__content">
                                        <el-row>
                                            <el-col
                                                    :xs="{ span: 20}"
                                                    :sm="{ span: 12}"
                                                    :md="{ span: 12}"
                                                    :lg="{ span: 6}"
                                            >
                                                <el-autocomplete
                                                        v-model="fInput"
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
                                                <el-button type="primary" @click="loadFUser(fInput)">
                                                    <el-icon><Search /></el-icon>
                                                    <el-text size="large">搜索</el-text>
                                                </el-button>
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-table :data="tableFilter"
                                                      style="width: 100%"
                                                      @row-click="handleRowClick"
                                            >
                                                <el-table-column label="Uuid" width="400">
                                                    <template #default="scope">
                                                        <div style="display: flex; align-items: center">
                                                            <el-icon><User /></el-icon>
                                                            <span style="margin-left: 10px">{{ scope.row.uuid }}</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="用户名" width="180">
                                                    <template #default="scope">
                                                        <div style="display: flex; align-items: center">
                                                            <span style="margin-left: 10px">{{ scope.row.lastName }}</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>

                                                <el-table-column label="IP" width="180">
                                                    <template #default="scope">
                                                        <div style="display: flex; align-items: center">
                                                            <span style="margin-left: 10px">{{ scope.row.lastIp }}</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="最后登录时间" width="180">
                                                    <template #default="scope">
                                                        <div style="display: flex; align-items: center">
                                                            <span style="margin-left: 10px">{{ scope.row.lastTime }}</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="最早登录时间" width="180">
                                                    <template #default="scope">
                                                        <div style="display: flex; align-items: center">
                                                            <span style="margin-left: 10px">{{ scope.row.firstTime }}</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>

                                            </el-table>

                                        </el-row>
                                        <el-form :model="banInput" ref="loginForm">
                                            <el-form-item label="Uuid" :label-width="60">
                                                <el-input v-model="banInput.uuid" placeholder="请输入用户UUID"/>
                                            </el-form-item>
                                            <el-form-item label="封禁时间" :label-width="60">
                                                <el-input v-model="banInput.time" placeholder="请输入时间/min"/>
                                            </el-form-item>
                                            <el-form-item label="封禁原因" :label-width="60">
                                                <el-input v-model="banInput.reason" placeholder="请输入封禁原因"/>
                                            </el-form-item>
                                        </el-form>
                                        <el-button type="primary" :loading="loadingM" @click="loadingM = true;banUser(banInput)">{{
                                                loadingM ? '执行中 ...' : '封禁用户'
                                            }}</el-button>
                                    </div>
                                </el-dialog>
                            </el-button>
                            <el-button type="danger" :disabled="true">
                                <el-icon><DeleteFilled /></el-icon>
                                <el-text size="large">解禁用户</el-text>
                            </el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row>
                    <el-table v-if="!(dialogM || dialogE)"
                              :data="tableData"
                              style="width: 100%"
                    >
                        <el-table-column label="Uuid" width="400">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <el-icon><User /></el-icon>
                                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="用户名" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.lastName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="绑定账号" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.profile }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="执行账号" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.operator  }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="封禁开始时间" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.startTime ? scope.row.startTime : "永久封禁" }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="封禁结束时间" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.endTime ? scope.row.endTime : "永久封禁" }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template #default="scope">

                                <el-button
                                        size="small"
                                        type="danger"
                                        @click="unBanUser(scope.row.id)"
                                >解禁</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>

                </el-row>
            </el-card>

        </el-col>
    </el-row>

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
import {onMounted, ref} from "vue";
import axios from "axios";
import {ElDialog, ElMessage} from "element-plus";
const dialogM = ref(false)
const loadingM = ref(false)
const dialogE = ref(false)


interface FUser {
    uuid:string
    lastName:string
    lastIp:string
    lastTime:string
    firstTime:string
}

interface BanX {
    uuid:string
    time:number
    reason:string
}

interface User {
    id: string
    lastName: string
    profile: string
    operator: string
    startTime:string
    endTime:string
}
const tableData = ref<User[]>([])
const tableFilter = ref<FUser[]>([])
const banInput = ref<BanX>({reason: "无", time: 5, uuid: ""})
const input = ref("")
const fInput = ref("")


onMounted(()=>{
    axios.get(`https://new.xem8k5.top:1080/api/bans`)
            .then(response => {
                tableData.value.push(...response.data)
                console.log(tableData)
            })
            .catch(error => {
                ElMessage.error(`发生错误：${error.response.data}`);
                console.log(error)
            })
})
const handleRowClick = (row: FUser) => {
    banInput.value.uuid = row.uuid
}
const loadFUser=(filer:string)=>{
    tableFilter.value = []
    axios.get(`https://new.xem8k5.top:1080/api/findPlayer?name=${filer}`)
            .then(response => {
                tableFilter.value.push(...response.data)
                console.log(tableFilter)
            })
            .catch(error => {
                ElMessage.error(`发生错误：${error.response.data}`);
                console.log(error)
            })
}

const loadUser=()=>{
    tableData.value = []
    axios.get(`https://new.xem8k5.top:1080/api/bans`)
            .then(response => {
                tableData.value.push(...response.data)
                console.log(tableData)
            })
            .catch(error => {
                ElMessage.error(`发生错误：${error.response.data}`);
                console.log(error)
            })
}

const unBanUser=(uuid: string)=>{
    tableData.value = []
    axios.get(`https://new.xem8k5.top:1080/api/unbanX?uid=${uuid}`)
            .then(response => {
                loadUser()
                const data = response.data;
                ElMessage({
                    message: "OK"+data,
                    type: "success"
                })
            })
            .catch(error => {
                ElMessage.error(`发生错误：${error.response.data}`);
                console.log(error)
            })
}

const banUser=(row: BanX)=>{
    axios.get(`https://new.xem8k5.top:1080/api/banX?uid=${row.uuid}&time=${row.time}&reason=${row.reason}`)
            .then(response => {
                loadUser()
                loadingM.value = false
                const data = response.data;
                ElMessage({
                    message: `OK`+data,
                    type: "success"
                })
            })
            .catch(error => {
                loadingM.value = false
                ElMessage({
                    message: error.response.data,
                    type: "error"
                })
            })
}


</script>





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
                            <template #default="{ item }">
                                <div class="value">{{ item.value }}</div>
                                <span class="link">{{ item.link }}</span>
                            </template>
                        </el-autocomplete>

                    </el-col>

                    <el-col
                            :xs="{ span: 4}"
                            :sm="{ span: 4}"
                            :md="{ span: 4}"
                            :lg="{ span: 2}"
                    >
                        <el-button type="primary">
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
                            <el-button type="success" @click="dialogM = true">
                                <el-icon><Plus /></el-icon>
                                <el-text size="large">新建用户</el-text>
                                <el-dialog v-model="dialogM"
                                           title="创建用户"
                                           direction="ltr"
                                           :show-close="false"
                                           height="30%"
                                           :inputmode="true"
                                           v-loading="loadingM">
                                    <div class="demo-drawer__content">
                                        <el-form :model="userFormData" ref="loginForm">
                                            <el-form-item label="用户" :label-width="60">
                                                <el-input v-model="userFormData.name" placeholder="请输入用户名"/>
                                            </el-form-item>

                                            <el-form-item label="密码" :label-width="60">
                                                <el-input
                                                        v-model="userFormData.password"
                                                        type="password"
                                                        placeholder="请输入密码"
                                                        show-password
                                                />
                                            </el-form-item>
                                            <el-form-item label="权限等级" :label-width="60">
                                                <el-select-v2
                                                        v-model="userFormData.authority"
                                                        filterable
                                                        :options="options"
                                                        placeholder="选择"
                                                        style="width: 240px"
                                                >
                                                    <template #default="{ item }">
                                                        <span style="margin-right: 8px">{{ item.value }}</span>
                                                        <span style="color: var(--el-text-color-secondary); font-size: 13px">{{ item.label }}</span>
                                                    </template>
                                                </el-select-v2>
                                            </el-form-item>
                                        </el-form>
                                        <el-button type="primary" :loading="loadingM" @click="loadingM = true;createUser()">{{
                                                loadingM ? '创建中 ...' : '创建用户'
                                            }}</el-button>
                                    </div>
                                </el-dialog>
                            </el-button>
                            <el-button type="danger">
                                <el-icon><DeleteFilled /></el-icon>
                                <el-text size="large">删除用户</el-text>
                            </el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row>


                    <el-table v-if="!dialogM"
                            :data="tableData"
                            style="width: 100%"
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
                                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="权限等级" width="180">
                            <template #default="scope">
                                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                                    <template #default>
                                        <div>权限等级: {{ scope.row.authority }}</div>
                                        <div>{{scope.row.authority == 0 ? scope.row.authority == 2 ? "普通用户" : "超级管理员:最高权限可以管理任何人员":"管理员:可以对普通用户和玩家进行管理"}}</div>
                                    </template>
                                    <template #reference>
                                        <el-tag>{{scope.row.authority == 0 ? "普通用户" : scope.row.authority == 2 ? "超级管理员":"管理员"}}</el-tag>
                                    </template>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="注册时间" width="180">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <span style="margin-left: 10px">{{ scope.row.time }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                                >编辑</el-button
                                >
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
const loadingM = ref(false)
const options = ref([
    {
        value: `0`,
        label: `普通用户`,
    },
    {
        value: `1`,
        label: `管理员`,
    },
    {
        value: `2`,
        label: `超级管理员`,
    }

])
let userFormData = reactive({
    name: null,
    password: null,
    authority: null,
})

interface User {
    time: string
    name: string
    uuid: string
    authority: number
    id:number
}
const tableData = ref<User[]>([])
const input = ref("")
const handleEdit = (index: number, row: User) => {
    console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
    console.log(index, row)
}

onMounted(()=>{
    axios.get('https://new.xem8k5.top:1080/api/getUsers')
            .then(response => {
                tableData.value.push(...response.data)
                console.log(tableData)
            })
            .catch(error => {
                ElMessage.error(`发生错误：${error}`);
                console.log(error)
            })
})
const loadUser=()=>{
    tableData.value = []
    axios.get('https://new.xem8k5.top:1080/api/getUsers')
            .then(response => {
                tableData.value.push(...response.data)
                console.log(tableData)
            })
            .catch(error => {
                ElMessage.error(`发生错误：${error}`);
                console.log(error)
            })
}

const createUser=()=>{
    if(userFormData.name != null && userFormData.password != null && userFormData.authority != null) {
        const credentials = {
            name: userFormData.name,
            protectKey: userFormData.password,
            anthority: userFormData.authority
        };
        const jsonCredentials = JSON.stringify(credentials);
        const base64Credentials = btoa(jsonCredentials);
        const loginPacket = {
            base64: base64Credentials
        };
        axios.post('https://new.xem8k5.top:1080/api/createUser', loginPacket, {
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
                    loadingM.value = false
                    dialogM.value = false;
                })
                .catch(error => {
                    ElMessage({
                        message: error.response.data,
                        type: "error"
                    })
                })
    }else{
        ElMessage({
            message: "请输入完整数据",
            type: "error"
        })
        loadingM.value = false
    }
}
</script>



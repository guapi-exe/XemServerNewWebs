

<template>
    <chile ref="childComp"></chile>
    <el-col
            :xs="{ span: 24}"
            :sm="{ span:12}"
            :md="{ span: 8}"
            :lg="{ span: 6}"
            style="padding-right: 8px; padding-left: 8px;"
            type="flex"
    >
        <el-card class="cord-body" >
            <el-image :src="schematicData.preview" fit="contain" type="flex"/>
            <el-divider></el-divider>
            <!--
                <el-tag v-for="(tag, index) in schematicData.tags" :key="index" :data="tag" type="primary">
                    <div class="parent">
                        <span :class="['sprite',tag,'sprite-small']" ></span>{{tag}}
                    </div>
                </el-tag>
                 -->
            <el-space size="small">
                <el-tag type="primary">
                    id:{{schematicData.id}}
                </el-tag>
                <el-tag type="primary">
                    <el-icon><User /></el-icon>:{{schematicData.author}}
                </el-tag>
                <el-tag type="primary">
                    <el-icon><View /></el-icon>:{{schematicData.heat}}
                </el-tag>
            </el-space>


            <el-row type="flex" justify="start">
                <h3>
                    {{schematicData.name}}
                </h3>
                <el-text size="default">
                    {{schematicData.desc}}
                </el-text>
            </el-row>
            <template #footer>
                <el-row type="flex" justify="center">
                    <el-button-group>
                        <el-button type="primary" :icon="CopyDocument" @click="copyToClipboard(schematicInfo.base64)"/>
                        <el-button type="primary" :icon="Download" @click="downloadSchematic(schematicData.id)"/>
                        <el-popconfirm
                                confirm-button-text="Yes"
                                cancel-button-text="No"
                                :icon="Delete"
                                icon-color="#626AEF"
                                title="你确定删除吗,该操作不可逆?"
                                @confirm="deleteSchematic(schematicData.id)"
                        >
                            <template #reference>
                                <el-button type="danger" :icon="Delete"/>
                            </template>
                        </el-popconfirm>
                        <el-button type="primary" :icon="Edit" @click="edit=true;loadInfo(schematicData.id)"/>
                    </el-button-group>

                    <el-dialog v-model="edit" :show-close="false"height="30%" v-loading="loading">
                        <el-space direction="horizontal" size="small">
                            <el-space direction="vertical" alignment="normal" size="small">
                                <el-row type="flex" justify="center">
                                    <h2>
                                        蓝图id:{{schematicData.id}}|名字:{{schematicData.name}}
                                    </h2>
                                </el-row>
                                <el-image :src="schematicData.preview" fit="contain"></el-image>
                                <el-space direction="vertical" alignment="normal" size="small">
                                    <el-text size="large">
                                        简介:{{schematicData.desc}}
                                    </el-text>
                                    <el-text size="large">
                                        标识码:{{schematicData.uuid}}
                                    </el-text>
                                    <el-text size="large">
                                        宽高:{{schematicInfo.width}}*{{schematicInfo.height}}
                                    </el-text>
                                </el-space>
                                <el-divider></el-divider>
                                <el-text size="large">建造需求:</el-text>
                                <el-row type="flex">
                                    <el-space wrap>
                                        <el-tag  v-for="(amount, item) in schematicInfo.requirements">
                                            <div class="parent">
                                                <span :class="['sprite',item.toString().toLowerCase(),'sprite-small-right']" ></span>
                                                <h3>{{amount}}</h3>
                                            </div>
                                        </el-tag>
                                    </el-space>
                                </el-row>
                                <el-text size="large">能量需求:</el-text>
                                <el-row type="flex">
                                    <div class="parent">
                                        <el-space wrap>
                                            <el-tag>
                                                <h3 style="font-family: MdtIcon,sans-serif;color: orange">{{ '\uE810' }}+{{(schematicInfo.powerOut*60).toFixed(2)}}/s</h3>
                                            </el-tag>
                                            <el-tag>
                                                <h3 style="font-family: MdtIcon,sans-serif;color: red">{{ '\uE810' }}-{{(schematicInfo.powerInput*60).toFixed(2)}}/s</h3>
                                            </el-tag>
                                        </el-space>
                                    </div>
                                </el-row>
                                <el-text size="large" v-if="schematicInfo.production !== null">资源消耗:</el-text>
                                <el-row type="flex">
                                    <el-space wrap>
                                        <el-tag v-for="(amount, item) in schematicInfo.production">
                                            <div class="parent" >
                                                <span :class="['sprite',item.toString().toLowerCase(),'sprite-small-right']" ></span>
                                                <h3>{{amount.toFixed(2)}}/s</h3>
                                            </div>
                                        </el-tag>
                                    </el-space>


                                </el-row>
                                <el-row type="flex" justify="center">

                                    <el-button type="primary" :icon="CopyDocument" @click="copyToClipboard(schematicInfo.base64);"/>
                                    <el-button type="primary" :icon="Download" @click="downloadSchematic(schematicData.id)"/>
                                    <el-popconfirm
                                            confirm-button-text="Yes"
                                            cancel-button-text="No"
                                            :icon="Delete"
                                            icon-color="#626AEF"
                                            title="你确定删除吗,该操作不可逆?"
                                            @confirm="deleteSchematic(schematicData.id);"
                                    >
                                        <template #reference>
                                            <el-button type="danger" :icon="Delete"/>
                                        </template>
                                    </el-popconfirm>
                                </el-row>
                            </el-space>
                        </el-space>
                    </el-dialog>
                </el-row>
            </template>
        </el-card>
    </el-col>
</template>


<script setup>
import {CopyDocument, Delete, Download, Edit, Upload, UploadFilled, User, View} from "@element-plus/icons-vue";
import {ElButton, ElDialog, ElDivider, ElMessage, ElMessageBox} from "element-plus";
import axios from "axios";
import {ref} from "vue";
const edit = ref(false)
const loading = ref(false)
const copydocument = ref(false)
const loaderr = ref(false)
const schematicInfo = ref({});
const childComp = ref(null)
const emit = defineEmits(["deleteSchematic"])
const deleteSchematic = (id) => {
    axios.get(`https://new.xem8k5.top:1080/api/deleteSchematic?id=${id}`)
            .then((response) => {
                edit.value=false
                emit('deleteSchematic')
                ElMessage({
                    message: "删除成功",
                    type: "success"
                })
            })
            .catch(error => {
                console.error('Error:', error);
                emit('deleteSchematic')
                ElMessage({
                    message: `删除错误：${error.response.data}|${error.response.status}`,
                    type: "error"
                })
            });
}
const loadInfo = (id) => {
    loading.value = true;

    axios.get(`https://new.xem8k5.top:1080/api/schematicMoreInfo?id=${id}`)
            .then((response) => {
                loaderr.value=false
                schematicInfo.value = response.data
                loading.value = false;
            })
            .catch(error => {
                console.error('Error:', error);
                loaderr.value=true
                ElMessage({
                    message: `发生错误：${error.response.data}|${error.response.status}`,
                    type: "error"
                })
            });
};

const downloadSchematic=(id)=>{
    window.location.href = `https://new.xem8k5.top:1080/api/schematicFile?id=${id}`;
}
const copyToClipboard=(text)=> {
    navigator.clipboard.writeText(text)
            .then(() => {
                ElMessage({
                    message: "复制成功",
                    type: "success"
                })
            })
            .catch(err => {
                ElMessage({
                    message: "复制失败:"+err,
                    type: "error"
                })
            });
}

</script>
<script>
export default {

    props: {
        data: {
            type: JSON,
            required: true
        }
    },
    data() {
        return {
            schematicData: {
                id: this.data.id,
                tags: this.data.tags.slice(1, -1).split(', '),
                tilesCode: this.data.tilesCode,
                heat: this.data.heat,
                name: this.data.name,
                desc: this.data.desc,
                uuid: this.data.uuid,
                author: this.data.author,
                preview:this.data.preview
            },
            schematicInfo: {
                name: this.data.name,
                base64: this.data.base64,
                tags: this.data.tags,
                desc: this.data.desc,
                requirements: this.data.requirements,
                height: this.data.height,
                width: this.data.width,
                production : this.data.production,
                power: this.data.power,
                powerOut: this.data.powerOut,
                powerInput: this.data.powerInput,
            }

        };
    },
    methods: {

    }
};
</script>

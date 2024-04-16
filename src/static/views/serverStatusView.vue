<template>
    <el-backtop :right="100" :bottom="100"/>
    <el-card shadow="always" class="cord-body">
        <el-row type="flex" justify="center" align="middle">
            <el-col
                    :xs="{ span: 24}"
                    :sm="{ span: 24}"
                    :md="{ span: 12}"
                    :lg="{ span: 12}"
            >
                <el-image :src="`data:image/png;base64,${serverStatus.mapSnap}`"></el-image>

            </el-col>
            <el-col
                    :xs="{ span: 24}"
                    :sm="{ span: 24}"
                    :md="{ span: 12}"
                    :lg="{ span: 12}"
            >
                <el-row>
                    <el-col :span="24">
                        <div id="tpsChart" style="height:200px"></div>
                    </el-col>
                    <el-col>
                        <div id="playersChart" style="height:200px"></div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col
                    :xs="{ span: 24}"
                    :sm="{ span: 24}"
                    :md="{ span: 12}"
                    :lg="{ span: 12}"
            >
                <el-row>
                    <el-col :span="24">
                        <el-text size="large">
                            服务器内存占用:{{serverStatus.Ram}}MB/限制:4096MB
                        </el-text>
                        <div class="demo-progress">
                            <el-progress
                                    :text-inside="true"
                                    :stroke-width="24"
                                    status="success"
                                    :percentage="((Number(serverStatus.Ram)/maxRam)*100).toFixed(2)" :color="customColors" />
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-text size="large">
                            服务器:{{serverStatus.name}}
                        </el-text>
                    </el-col>
                    <el-col :span="24">
                        <el-icon><Reading /></el-icon>
                        <el-text size="large">
                            地图:{{serverStatus.mapName}}|ID:{{serverStatus.mapId}}|波次:{{serverStatus.mapWave}}
                        </el-text>
                    </el-col>
                    <el-col :span="24">
                        <el-icon><Reading /></el-icon>
                        <el-text size="large">
                            地图游玩时间:{{serverStatus.mapPlayTime}}/min
                        </el-text>
                    </el-col>
                    <el-col :span="24">
                        <el-icon><Star /></el-icon>
                        <el-text size="large">
                            版本:{{serverStatus.version}}
                        </el-text>
                    </el-col>
                    <el-col :span="24">
                        <el-icon><SwitchFilled /></el-icon>
                        <el-text size="large">
                            当前在线:{{serverStatus.players}}
                        </el-text>

                    </el-col>
                    <el-col :span="24">
                        <el-icon><Loading /></el-icon>
                        <el-text size="large">
                            TPS:{{serverStatus.tps}}
                        </el-text>
                    </el-col>
                </el-row>

            </el-col>
            <el-col
                    :xs="{ span: 24}"
                    :sm="{ span: 24}"
                    :md="{ span: 12}"
                    :lg="{ span: 12}"
            >
                <el-card class="cord-body" style="height: 300px;overflow:auto">
                    <el-row v-for="player in serverStatus.playerList">
                        <el-col>
                            <el-row>
                                <el-col :span="18">
                                    <div class="parent">
                                        <span :class="['sprite',`unit-${player.unitType}`,'sprite-small']" ></span>
                                        <div v-html="generateSpanElements(player.name)"></div>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <el-button-group>
                                        <el-button type="primary" :icon="CopyDocument" @click="copyToClipboard(player.name)"></el-button>
                                    </el-button-group>
                                    <el-button-group>
                                        <el-button type="primary" :icon="Edit"></el-button>
                                    </el-button-group>
                                    <el-button-group>
                                        <el-button type="danger"><h3 style="font-family: MdtIcon,sans-serif;color: white">{{ '\uE81A' }}</h3></el-button>
                                    </el-button-group>
                                </el-col>
                            </el-row>
                            <el-divider></el-divider>
                        </el-col>
                    </el-row>
                </el-card>

            </el-col>
        </el-row>
    </el-card>
</template>


<script setup lang="ts">
import {Reading, Star, SwitchFilled, Loading, CopyDocument, Edit} from '@element-plus/icons-vue'
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';
import axios from "axios";
import {ElButton, ElDivider, ElMessage} from "element-plus";
const serverStatus = ref({
    name: null,
    version: null,
    mapId: null,
    mapName: null,
    mapWave: null,
    mapPlayTime: null,
    tps: null,
    Ram: null,
    players: null,
    playerList: [
        {
            name:"",
            admin:null,
            unit:null,
            unitType:null,
            player:null,
            x:null,
            y:null,
            rotation:null,
        },
    ],
    allUnit: null,
    mapSnap: null,
    timeList: null,
    tpsList: null,
    playersList: null
})
const maxRam = ref(4096)
onMounted(() => {
    axios.get("https://new.xem8k5.top:1080/api/serverStatus").then((res) => {
        serverStatus.value = res.data;
        const tpsChart = echarts.init(document.getElementById('tpsChart'));
        const playersChart = echarts.init(document.getElementById('playersChart'));
        tpsChart.setOption({
            title: {
                text: 'TPS'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['TPS']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: serverStatus.value.timeList
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'tps',
                    type:'line',
                    stack: 'tps',
                    data:serverStatus.value.tpsList
                }
            ]

        });
        playersChart.setOption({
            title: {
                text: '玩家数'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['玩家数']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: serverStatus.value.timeList
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'玩家数',
                    type:'line',
                    stack: '玩家数',
                    data:serverStatus.value.playersList
                }
            ]

        });
    })
})

const customColors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 },
]

const colormap = new Map();
colormap.set("CLEAR", "#00000000");
colormap.set("BLACK", "#000000");
colormap.set("WHITE", "#000000");
colormap.set("LIGHT_GRAY", "#bfbfbf");
colormap.set("GRAY", "#7f7f7f");
colormap.set("DARK_GRAY", "#3f3f3f");
colormap.set("LIGHT_GREY", "#bfbfbf");
colormap.set("GREY", "#7f7f7f");
colormap.set("DARK_GREY", "#3f3f3f");
colormap.set("BLUE", "#4169e1");
colormap.set("NAVY", "#00007f");
colormap.set("ROYAL", "#4169e1");
colormap.set("SLATE", "#708090");
colormap.set("SKY", "#87ceeb");
colormap.set("CYAN", "#00ffff");
colormap.set("TEAL", "#007f7f");
colormap.set("GREEN", "#38d667");
colormap.set("ACID", "#7fff00");
colormap.set("LIME", "#32cd32");
colormap.set("FOREST", "#228b22");
colormap.set("OLIVE", "#6b8e23");
colormap.set("YELLOW", "#ffff00");
colormap.set("GOLD", "#ffd700");
colormap.set("GOLDENROD", "#daa520");
colormap.set("ORANGE", "#ffa500");
colormap.set("BROWN", "#8b4513");
colormap.set("TAN", "#d2b48c");
colormap.set("BRICK", "#b22222");
colormap.set("RED", "#e55454");
colormap.set("SCARLET", "#ff341c");
colormap.set("CRIMSON", "#dc143c");
colormap.set("CORAL", "#ff7f50");
colormap.set("SALMON", "#fa8072");
colormap.set("PINK", "#ff69b4");
colormap.set("MAGENTA", "#ff00ff");
colormap.set("PURPLE", "#a020f0");
colormap.set("VIOLET", "#ee82ee");
colormap.set("MAROON", "#b03b60");


function generateSpanElements(text: string): string {
    text = text.replace(/\[\]/g, "[white]");
    console.log()
    const colorRegex = /\[([^\]]+)\]([^\[]+|\[\])/g;
    let match;
    let result = '';
    let lastColor = '';

    while ((match = colorRegex.exec(text)) !== null) {
        const color = match[1];
        const content = match[2] ? match[2] : '';

        if (color !== lastColor) {
            if (lastColor !== '') {
                result += '</span>';
            }
            let relColor = colormap.get(color.toUpperCase());
            result += `<span style="color:${relColor}">${content}`;
            lastColor = color;
        } else {
            result += content;
        }
    }
    return result;
}

const copyToClipboard=(text:string)=> {
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


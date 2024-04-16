<template>
    <el-backtop :right="100" :bottom="100"/>
    <el-card shadow="always" class="cord-body">
        <el-row type="flex" justify="end">

            <el-col
                    :xs="{ span: 6}"
                    :sm="{ span: 2}"
                    :md="{ span: 2}"
                    :lg="{ span: 2}"
            >
                <el-text size="large">
                    tag检索器
                </el-text>
            </el-col>
            <el-col
                    :xs="{ span: 18}"
                    :sm="{ span: 6}"
                    :md="{ span: 6}"
                    :lg="{ span: 12}"
            >
                <div class="m-4">
                    <el-cascader
                            v-model="select"
                            :options="options"
                            @change="clearload"
                            :props="props"
                            :filterable="true"
                            :collapse-tags="true"
                    >
                        <template #default="{ node, data }">
                            <div class="parent">
                                <span :class="['sprite',data.value,'sprite-small']" ></span>
                                <span>{{ data.label }}</span>
                                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                            </div>
                        </template>
                    </el-cascader>

                </div>

            </el-col>
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
                        :fetch-suggestions="querySearch"
                        popper-class="my-autocomplete"
                        placeholder="搜索栏"
                        @select="handleSelect"
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
                <el-button>
                    <el-icon><Search /></el-icon>
                    <el-text size="large" @click="clearload">搜索</el-text>
                </el-button>
            </el-col>
            <el-col
                    :xs="{ span: 24}"
                    :md="{ span: 24}"
                    :lg="{ span: 2}"
            >

                <el-button plain @click="visible = true" color="#337ecc">
                    <el-icon><Upload /></el-icon>
                    <el-text size="large">上传蓝图</el-text>
                </el-button>
                <el-dialog v-model="visible" :show-close="false" width="50%" height="60%">
                    <el-text size="large">
                        蓝图上传
                    </el-text>
                    <el-row>
                        <el-col :span="24">
                            <el-upload
                                    class="upload"
                                    drag
                                    action="https://new.xem8k5.top:1080/api/uploadSchematic"
                                    multiple
                                    :on-error="uploadErr"
                                    :with-credentials="true"
                                    show-file-list
                                    accept="msch"
                            >
                                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                <div class="el-upload__text">
                                    拖拽文件至此 or <em>点击上传</em>
                                </div>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        仅允许上传蓝图文件，可以直接上传文件夹进行批量上传
                                    </div>
                                </template>
                            </el-upload>

                        </el-col>
                    </el-row>
                    <!--
                    <el-row type="flex" justify="end">
                        <el-col :span="20">
                            <el-input
                                    v-model="input"
                                    style="width: 98%"
                                    placeholder="上传蓝图代码"
                                    clearable
                            />

                        </el-col>
                        <el-col :span="2.5">
                            <el-button>
                                <el-icon><Upload /></el-icon>
                                <el-text size="large">确认上传</el-text>
                            </el-button>
                        </el-col>
                    </el-row>
                    -->


                </el-dialog>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row v-infinite-scroll="load" :infinite-scroll-disabled="loading" infinite-scroll-delay="1000" type="flex" style="margin-left: -8px; margin-right: -8px;">
            <SchematicRenderer v-for="(schematic, index) in schematicDatas" :key="index" :data="schematic" @deleteSchematic="deleteSchematic()"/>
        </el-row>
        <div class="parent"  v-if="noMore">
            <span :class="['sprite','alphaaaa','sprite-small']" ></span>
            <h4>没有更多了</h4>
        </div>

    </el-card>

</template>

<style lang="css" src="../css/sprites.css"></style>
<style lang="css" src="../css/schematic.css"></style>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search, Upload, UploadFilled } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElMessage } from 'element-plus'
import SchematicRenderer from "../units/schematicRenderer.vue";
import axios from "axios";
import { onMounted } from 'vue'

const visible = ref(false)
const input = ref('')
const select = ref([])
const props = { multiple: true }

const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const schematicDatas = ref<JSON[]>([])
const author = ref("")
interface LinkItem {
    value: string
    link: string
}

const links = ref<LinkItem[]>([])

const querySearch = (queryString: string, cb: any) => {
    const results = queryString
            ? links.value.filter(createFilter(queryString))
            : links.value
    // call callback function to return suggestion objects
    cb(results)
}
const createFilter = (queryString:String) => {
    return (restaurant: any) => {
        return (
                restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}
const loadAll = () => {
    return [
        { value: '@begin=', link: '设定搜索起始位置' },
        { value: '@author=', link: '搜索指定作者的作品,使用‘,’分离搜索条件' }
    ]
}
const handleSelect = (item: LinkItem) => {
    console.log(item)
}

onMounted(() => {
    links.value = loadAll()
})

const clearload = () => {
    schematicDatas.value = []
    page.value = 1
    load()
}
const clearloadpage = () => {
    schematicDatas.value = []
    load()
}
const deleteSchematic = () => {
    clearloadpage()
}

const load = async () => {
    try {
        loading.value = true;
        const tags = select.value.flatMap((item: any[]) => Array.isArray(item) ? item.slice(-1) : []);
        const tagParam = tags.length ? `&tags=[${tags}]` : '';
        let filter = input.value
        let pattern = /^@begin=(\d+)/;

        if (pattern.test(input.value) && input.value.length > 0) {
            let matches = input.value.match(pattern);
            if(matches == null) return
            input.value = ""
            page.value = Number(matches[1])
        }

        let pattern2 = /^@author=(\d+)/;
        if (pattern2.test(input.value) && input.value.length > 0) {
            let matches = input.value.match(pattern2);
            if(matches == null) return
            filter = filter.replace(pattern2,"")
            filter = filter.replace(",", "")
            author.value = matches[1]
        }else {
            author.value = ""
        }

        const authorParam = author.value.length != 0 ? `&author=${author.value}` : '';
        const response = await axios.get(`https://new.xem8k5.top:1080/api/schematics?begin=${page.value}&filter=${filter}${tagParam}${authorParam}`);

        const jsonData = response.data;
        if (jsonData.length === 0) {
            noMore.value = true;
            return;
        }

        schematicDatas.value.push(...jsonData);
        page.value = jsonData[jsonData.length - 1]["id"] + 1;
    } catch (error) {
        console.error('Error:', error);
        ElMessage.error(`发生错误：${error}`);
    } finally {
        loading.value = false;
    }
};
const uploadErr =(error:Error)=> {
    ElMessage.error(`发生错误：${error}`);
}
const options = [
    {
        "value": "blocks",
        "label": "方块",
        "children": [
            {
                "value": "campaign",
                "label": "战役",
                "children": [
                    {
                        "value": "interplanetary-accelerator",
                        "label": "行星际加速器"
                    },
                    {
                        "value": "launch-pad",
                        "label": "发射台"
                    }
                ]
            },
            {
                "value": "defense",
                "label": "防御",
                "children": [
                    {
                        "value": "build-tower",
                        "label": "建造塔"
                    },
                    {
                        "value": "force-projector",
                        "label": "力墙投影"
                    },
                    {
                        "value": "mend-projector",
                        "label": "修理投影"
                    },
                    {
                        "value": "mender",
                        "label": "修理器"
                    },
                    {
                        "value": "overdrive-dome",
                        "label": "超速穹顶"
                    },
                    {
                        "value": "overdrive-projector",
                        "label": "超速投影"
                    },
                    {
                        "value": "parallax",
                        "label": "差扰"
                    },
                    {
                        "value": "radar",
                        "label": "雷达"
                    },
                    {
                        "value": "regen-projector",
                        "label": "再生投影器"
                    },
                    {
                        "value": "segment",
                        "label": "裂解"
                    },
                    {
                        "value": "shield-projector",
                        "label": "护盾投影器"
                    },
                    {
                        "value": "shock-mine",
                        "label": "脉冲地雷"
                    },
                    {
                        "value": "shockwave-tower",
                        "label": "震爆塔"
                    }
                ]
            },
            {
                "value": "distribution",
                "label": "运输",
                "children": [
                    {
                        "value": "bridge-conveyor",
                        "label": "传送带桥"
                    },
                    {
                        "value": "distributor",
                        "label": "分配器"
                    },
                    {
                        "value": "ducts",
                        "label": "管道",
                        "children": [
                            {
                                "value": "duct-bridge",
                                "label": "物品管道桥"
                            },
                            {
                                "value": "duct-router",
                                "label": "物品管道路由器"
                            },
                            {
                                "value": "duct-unloader",
                                "label": "管道装卸器"
                            },
                            {
                                "value": "overflow-duct",
                                "label": "溢流管道"
                            },
                            {
                                "value": "surge-router",
                                "label": "合金路由器"
                            },
                            {
                                "value": "underflow-duct",
                                "label": "反向溢流管"
                            }
                        ]
                    },
                    {
                        "value": "inverted-sorter",
                        "label": "反向分类器"
                    },
                    {
                        "value": "junction",
                        "label": "交叉器"
                    },
                    {
                        "value": "mass-driver",
                        "label": "质量驱动器"
                    },
                    {
                        "value": "overflow-gate",
                        "label": "溢流门"
                    },
                    {
                        "value": "phase-conveyor",
                        "label": "相织布传送带桥"
                    },
                    {
                        "value": "router",
                        "label": "路由器"
                    },
                    {
                        "value": "sorter",
                        "label": "分类器"
                    },
                    {
                        "value": "stack-conveyors",
                        "label": "复合传送带",
                        "children": [
                            {
                                "value": "plastanium-conveyor",
                                "label": "塑钢传送带"
                            },
                            {
                                "value": "surge-conveyor",
                                "label": "合金传送带"
                            }
                        ]
                    },
                    {
                        "value": "underflow-gate",
                        "label": "反向溢流门"
                    }
                ]
            },
            {
                "value": "drills",
                "label": "钻头",
                "children": [
                    {
                        "value": "blast-drill",
                        "label": "爆破钻头"
                    },
                    {
                        "value": "cliff-crusher",
                        "label": "墙壁粉碎机"
                    },
                    {
                        "value": "eruption-drill",
                        "label": "爆裂钻头"
                    },
                    {
                        "value": "impact-drill",
                        "label": "冲击钻头"
                    },
                    {
                        "value": "laser-drill",
                        "label": "激光钻头"
                    },
                    {
                        "value": "mechanical-drill",
                        "label": "机械钻头"
                    },
                    {
                        "value": "oil-extractor",
                        "label": "石油钻井"
                    },
                    {
                        "value": "plasma-bore",
                        "label": "等离子钻机"
                    },
                    {
                        "value": "pneumatic-drill",
                        "label": "气动钻头"
                    },
                    {
                        "value": "water-extractor",
                        "label": "抽水机"
                    }
                ]
            },
            {
                "value": "liquid",
                "label": "流体",
                "children": [
                    {
                        "value": "bridge-conduit",
                        "label": "导管桥"
                    },
                    {
                        "value": "impulse-pump",
                        "label": "脉冲泵"
                    },
                    {
                        "value": "liquid-container",
                        "label": "流体容器"
                    },
                    {
                        "value": "liquid-junction",
                        "label": "流体交叉器"
                    },
                    {
                        "value": "liquid-router",
                        "label": "流体路由器"
                    },
                    {
                        "value": "liquid-tank",
                        "label": "流体储罐"
                    },
                    {
                        "value": "mechanical-pump",
                        "label": "机械泵"
                    },
                    {
                        "value": "phase-conduit",
                        "label": "相织布导管桥"
                    },
                    {
                        "value": "reinforced-pump",
                        "label": "强化泵"
                    },
                    {
                        "value": "rotary-pump",
                        "label": "回转泵"
                    }
                ]
            },
            {
                "value": "logic",
                "label": "逻辑",
                "children": [
                    {
                        "value": "canvas",
                        "label": "画板"
                    },
                    {
                        "value": "hyper-processor",
                        "label": "超核处理器"
                    },
                    {
                        "value": "logic-display",
                        "label": "逻辑显示屏"
                    },
                    {
                        "value": "logic-processor",
                        "label": "逻辑处理器"
                    },
                    {
                        "value": "memory-bank",
                        "label": "内存库"
                    },
                    {
                        "value": "memory-cell",
                        "label": "内存元"
                    },
                    {
                        "value": "message",
                        "label": "信息板"
                    },
                    {
                        "value": "micro-processor",
                        "label": "微型处理器"
                    },
                    {
                        "value": "reinforced-message",
                        "label": "强化信息板"
                    },
                    {
                        "value": "switch",
                        "label": "开关"
                    },
                    {
                        "value": "world-cell",
                        "label": "世界内存元"
                    },
                    {
                        "value": "world-message",
                        "label": "世界信息板"
                    },
                    {
                        "value": "world-processor",
                        "label": "世界处理器"
                    }
                ]
            },
            {
                "value": "payload",
                "label": "载荷",
                "children": [
                    {
                        "value": "constructor",
                        "label": "构筑器"
                    },
                    {
                        "value": "deconstructor",
                        "label": "大型解构器"
                    },
                    {
                        "value": "large-constructor",
                        "label": "大型构筑器"
                    },
                    {
                        "value": "payload-conveyor",
                        "label": "载荷传送带"
                    },
                    {
                        "value": "payload-loader",
                        "label": "载荷装载器"
                    },
                    {
                        "value": "payload-router",
                        "label": "载荷路由器"
                    },
                    {
                        "value": "payload-source",
                        "label": "载荷源"
                    },
                    {
                        "value": "payload-unloader",
                        "label": "载荷卸载器"
                    },
                    {
                        "value": "payload-void",
                        "label": "载荷黑洞"
                    },
                    {
                        "value": "small-deconstructor",
                        "label": "解构器"
                    }
                ]
            },
            {
                "value": "power",
                "label": "能量",
                "children": [
                    {
                        "value": "battery-large",
                        "label": "大型电池"
                    },
                    {
                        "value": "battery",
                        "label": "电池"
                    },
                    {
                        "value": "beam-link",
                        "label": "激光连接器"
                    },
                    {
                        "value": "beam-node",
                        "label": "激光节点"
                    },
                    {
                        "value": "beam-tower",
                        "label": "激光塔"
                    },
                    {
                        "value": "combustion-generator",
                        "label": "火力发电机"
                    },
                    {
                        "value": "differential-generator",
                        "label": "温差发电机"
                    },
                    {
                        "value": "diode",
                        "label": "二极管"
                    },
                    {
                        "value": "flux-reactor",
                        "label": "通量反应堆"
                    },
                    {
                        "value": "illuminator",
                        "label": "照明器"
                    },
                    {
                        "value": "impact-reactor",
                        "label": "冲击反应堆"
                    },
                    {
                        "value": "neoplasia-reactor",
                        "label": "瘤变反应堆"
                    },
                    {
                        "value": "power-node",
                        "label": "电力节点"
                    },
                    {
                        "value": "power-source",
                        "label": "电力源"
                    },
                    {
                        "value": "power-void",
                        "label": "电力黑洞"
                    },
                    {
                        "value": "pyrolysis-generator",
                        "label": "热解发生器"
                    },
                    {
                        "value": "rtg-generator",
                        "label": "RTG 发电机"
                    },
                    {
                        "value": "solar-panel",
                        "label": "太阳能板"
                    },
                    {
                        "value": "steam-generator",
                        "label": "涡轮发电机"
                    },
                    {
                        "value": "surge-tower",
                        "label": "巨浪电力塔"
                    },
                    {
                        "value": "thermal-generator",
                        "label": "热能发电机"
                    },
                    {
                        "value": "thorium-reactor",
                        "label": "钍反应堆"
                    },
                    {
                        "value": "turbine-condenser",
                        "label": "涡轮冷凝器"
                    }
                ]
            },
            {
                "value": "production",
                "label": "生产",
                "children": [
                    {
                        "value": "atmospheric-concentrator",
                        "label": "大气收集器"
                    },
                    {
                        "value": "blast-mixer",
                        "label": "爆炸物混合器"
                    },
                    {
                        "value": "carbide-crucible",
                        "label": "碳化物坩埚"
                    },
                    {
                        "value": "coal-centrifuge",
                        "label": "煤炭离心机"
                    },
                    {
                        "value": "cryofluid-mixer",
                        "label": "冷冻液混合器"
                    },
                    {
                        "value": "cultivator",
                        "label": "培养机"
                    },
                    {
                        "value": "cyanogen-synthesizer",
                        "label": "氰合成机"
                    },
                    {
                        "value": "disassembler",
                        "label": "解离机"
                    },
                    {
                        "value": "electric-heater",
                        "label": "电制热机"
                    },
                    {
                        "value": "electrolyzer",
                        "label": "电解机"
                    },
                    {
                        "value": "graphite-press",
                        "label": "石墨压缩机"
                    },
                    {
                        "value": "heat-reactor",
                        "label": "热量反应堆"
                    },
                    {
                        "value": "heat-redirector",
                        "label": "热量传输机"
                    },
                    {
                        "value": "heat-router",
                        "label": "热量路由器"
                    },
                    {
                        "value": "incinerator",
                        "label": "焚化炉"
                    },
                    {
                        "value": "kiln",
                        "label": "窑炉"
                    },
                    {
                        "value": "melter",
                        "label": "熔炉"
                    },
                    {
                        "value": "multi-press",
                        "label": "多重压缩机"
                    },
                    {
                        "value": "oxidation-chamber",
                        "label": "氧化室"
                    },
                    {
                        "value": "phase-heater",
                        "label": "相织制热机"
                    },
                    {
                        "value": "phase-synthesizer",
                        "label": "相织布合成机"
                    },
                    {
                        "value": "phase-weaver",
                        "label": "相织布编织器"
                    },
                    {
                        "value": "plastanium-compressor",
                        "label": "塑钢压缩机"
                    },
                    {
                        "value": "pulverizer",
                        "label": "粉碎机"
                    },
                    {
                        "value": "pyratite-mixer",
                        "label": "硫化物混合器"
                    },
                    {
                        "value": "separator",
                        "label": "分离机"
                    },
                    {
                        "value": "silicon-crucible",
                        "label": "热能坩埚"
                    },
                    {
                        "value": "silicon-smelter",
                        "label": "硅冶炼厂"
                    },
                    {
                        "value": "slag-centrifuge",
                        "label": "矿渣离心机"
                    },
                    {
                        "value": "slag-heater",
                        "label": "矿渣制热机"
                    },
                    {
                        "value": "slag-incinerator",
                        "label": "矿渣焚化炉"
                    },
                    {
                        "value": "spore-press",
                        "label": "孢子压缩机"
                    },
                    {
                        "value": "surge-crucible",
                        "label": "合金坩埚"
                    },
                    {
                        "value": "surge-smelter",
                        "label": "合金冶炼厂"
                    },
                    {
                        "value": "vent-condenser",
                        "label": "排气冷凝器"
                    }
                ]
            },
            {
                "value": "sandbox",
                "label": "沙盒",
                "children": [
                    {
                        "value": "heat-source",
                        "label": "热量源"
                    },
                    {
                        "value": "item-source",
                        "label": "物品源"
                    },
                    {
                        "value": "item-void",
                        "label": "物品黑洞"
                    },
                    {
                        "value": "liquid-source",
                        "label": "液体源"
                    },
                    {
                        "value": "liquid-void",
                        "label": "液体黑洞"
                    }
                ]
            },
            {
                "value": "storage",
                "label": "存储",
                "children": [
                    {
                        "value": "container",
                        "label": "容器"
                    },
                    {
                        "value": "core-acropolis",
                        "label": "卫城核心"
                    },
                    {
                        "value": "core-bastion",
                        "label": "城堡核心"
                    },
                    {
                        "value": "core-citadel",
                        "label": "堡垒核心"
                    },
                    {
                        "value": "core-foundation",
                        "label": "次代核心"
                    },
                    {
                        "value": "core-nucleus",
                        "label": "终代核心"
                    },
                    {
                        "value": "core-shard",
                        "label": "初代核心"
                    },
                    {
                        "value": "reinforced-container",
                        "label": "强化容器"
                    },
                    {
                        "value": "reinforced-vault",
                        "label": "强化仓库"
                    },
                    {
                        "value": "unloader",
                        "label": "装卸器"
                    },
                    {
                        "value": "vault",
                        "label": "仓库"
                    }
                ]
            },
            {
                "value": "turrets",
                "label": "炮塔",
                "children": [
                    {
                        "value": "afflict",
                        "label": "劫难"
                    },
                    {
                        "value": "arc",
                        "label": "电弧"
                    },
                    {
                        "value": "breach",
                        "label": "撕裂"
                    },
                    {
                        "value": "cyclone",
                        "label": "气旋"
                    },
                    {
                        "value": "diffuse",
                        "label": "扩散"
                    },
                    {
                        "value": "duo",
                        "label": "双管"
                    },
                    {
                        "value": "foreshadow",
                        "label": "厄兆"
                    },
                    {
                        "value": "fuse",
                        "label": "雷光"
                    },
                    {
                        "value": "hail",
                        "label": "冰雹"
                    },
                    {
                        "value": "lancer",
                        "label": "蓝瑟"
                    },
                    {
                        "value": "malign",
                        "label": "魔灵"
                    },
                    {
                        "value": "meltdown",
                        "label": "熔毁"
                    },
                    {
                        "value": "ripple",
                        "label": "浪涌"
                    },
                    {
                        "value": "salvo",
                        "label": "齐射"
                    },
                    {
                        "value": "scathe",
                        "label": "创伤"
                    },
                    {
                        "value": "scatter",
                        "label": "分裂"
                    },
                    {
                        "value": "scorch",
                        "label": "火焰"
                    },
                    {
                        "value": "smite",
                        "label": "天谴"
                    },
                    {
                        "value": "spectre",
                        "label": "幽灵"
                    },
                    {
                        "value": "sublimate",
                        "label": "升华"
                    },
                    {
                        "value": "swarmer",
                        "label": "蜂群"
                    },
                    {
                        "value": "titan",
                        "label": "泰坦"
                    },
                    {
                        "value": "tsunami",
                        "label": "海啸"
                    },
                    {
                        "value": "wave",
                        "label": "波浪"
                    }
                ]
            },
            {
                "value": "units",
                "label": "单位工厂",
                "children": [
                    {
                        "value": "additive-reconstructor",
                        "label": "数增级单位重构工厂"
                    },
                    {
                        "value": "air-factory",
                        "label": "空军工厂"
                    },
                    {
                        "value": "exponential-reconstructor",
                        "label": "多幂级单位重构工厂"
                    },
                    {
                        "value": "ground-factory",
                        "label": "陆军工厂"
                    },
                    {
                        "value": "mech-assembler",
                        "label": "机甲组装厂"
                    },
                    {
                        "value": "mech-fabricator",
                        "label": "机甲制造厂"
                    },
                    {
                        "value": "mech-refabricator",
                        "label": "机甲重构厂"
                    },
                    {
                        "value": "multiplicative-reconstructor",
                        "label": "倍乘级单位重构工厂"
                    },
                    {
                        "value": "naval-factory",
                        "label": "海军工厂"
                    },
                    {
                        "value": "prime-refabricator",
                        "label": "高级再重构工厂"
                    },
                    {
                        "value": "repair-point",
                        "label": "维修点"
                    },
                    {
                        "value": "repair-turret",
                        "label": "维修塔"
                    },
                    {
                        "value": "ship-assembler",
                        "label": "飞船组装厂"
                    },
                    {
                        "value": "ship-fabricator",
                        "label": "飞船制造厂"
                    },
                    {
                        "value": "ship-refabricator",
                        "label": "飞船重构厂"
                    },
                    {
                        "value": "tank-assembler",
                        "label": "坦克组装厂"
                    },
                    {
                        "value": "tank-fabricator",
                        "label": "坦克制造厂"
                    },
                    {
                        "value": "tank-refabricator",
                        "label": "坦克重构厂"
                    },
                    {
                        "value": "tetrative-reconstructor",
                        "label": "无量级单位重构工厂"
                    }
                ]
            },
            {
                "value": "walls",
                "label": "墙",
                "children": [
                    {
                        "value": "beryllium-wall",
                        "label": "铍墙"
                    },
                    {
                        "value": "blast-door",
                        "label": "防爆闸门"
                    },
                    {
                        "value": "carbide-wall",
                        "label": "碳化物墙"
                    },
                    {
                        "value": "copper-wall",
                        "label": "铜墙"
                    },
                    {
                        "value": "door-large",
                        "label": "大门"
                    },
                    {
                        "value": "door",
                        "label": "门"
                    },
                    {
                        "value": "phase-wall",
                        "label": "相织布墙"
                    },
                    {
                        "value": "plastanium-wall",
                        "label": "塑钢墙"
                    },
                    {
                        "value": "shielded-wall",
                        "label": "盾墙"
                    },
                    {
                        "value": "surge-wall",
                        "label": "合金墙"
                    },
                    {
                        "value": "thorium-wall",
                        "label": "钍墙"
                    },
                    {
                        "value": "thruster",
                        "label": "推进器残骸"
                    },
                    {
                        "value": "titanium-wall",
                        "label": "钛墙"
                    },
                    {
                        "value": "tungsten-wall",
                        "label": "钨墙"
                    }
                ]
            }
        ]
    },
    {
        "value": "items",
        "label": "产物",
        "children": [
            {
                "value": "beryllium",
                "label": "铍"
            },
            {
                "value": "carbide",
                "label": "碳化钨"
            },
            {
                "value": "coal",
                "label": "煤"
            },
            {
                "value": "copper",
                "label": "铜"
            },
            {
                "value": "graphite",
                "label": "石墨"
            },
            {
                "value": "lead",
                "label": "铅"
            },
            {
                "value": "blast-compound",
                "label": "爆炸混合物"
            },
            {
                "value": "phase-fabric",
                "label": "相织布"
            },
            {
                "value": "spore-pod",
                "label": "孢子夹"
            },
            {
                "value": "surge-alloy",
                "label": "巨浪合金"
            },
            {
                "value": "fissile-matter",
                "label": "裂变物质"
            },
            {
                "value": "metaglass",
                "label": "钢化玻璃"
            },
            {
                "value": "oxide",
                "label": "氧化物"
            },
            {
                "value": "plastanium",
                "label": "塑钢"
            },
            {
                "value": "pyratite",
                "label": "硫化物"
            },
            {
                "value": "sand",
                "label": "沙子"
            },
            {
                "value": "scrap",
                "label": "废料"
            },
            {
                "value": "silicon",
                "label": "硅"
            },
            {
                "value": "thorium",
                "label": "钍"
            },
            {
                "value": "titanium",
                "label": "钛"
            },
            {
                "value": "tungsten",
                "label": "钨"
            },
            {
                "value": "arkycite",
                "label": "绿水"
            },
            {
                "value": "cryofluid",
                "label": "冷冻液"
            },
            {
                "value": "cyanogen",
                "label": "氰气"
            },
            {
                "value": "gallium",
                "label": "镓"
            },
            {
                "value": "hydrogen",
                "label": "氢气"
            },
            {
                "value": "neoplasm",
                "label": "肿瘤浆液"
            },
            {
                "value": "nitrogen",
                "label": "氮气"
            },
            {
                "value": "oil",
                "label": "原油"
            },
            {
                "value": "ozone",
                "label": "臭氧"
            },
            {
                "value": "slag",
                "label": "矿渣"
            },
            {
                "value": "water",
                "label": "水"
            }
        ]
    }
]
// Expose the state and methods to parent components
defineExpose({
    schematicDatas,
    load,
    clearload
});

</script>



<template>
  <el-space direction="vertical" wrap alignment="start">
    <el-text size="large" type="warning">新版账号系统教程</el-text>
    <el-text tag="b">注册与登录</el-text>
    <el-text>所有的操作都基于一个梦魔短祷账号</el-text>
    <el-text>你可以通过右上角的按钮注册和登录</el-text>
    <el-text tag="b">账号信息查看:</el-text>
    <el-text>在完成注册或登录操作后，打开个人信息按钮，即可查看当前个人信息</el-text>
    <el-text tag="b">绑定qq：</el-text>
    <el-text>在个人信息页点击蓝色按钮获取绑定码后，在本群发送 <strong>认证 [绑定码]</strong> 即可绑定使用q群机器人。</el-text>
    <el-text>之后可以使用机器人的签到和个人信息指令</el-text>
    <el-text tag="b">绑定qq频道：</el-text>
    <el-text>在个人信息页点击蓝色按钮获取绑定码后，在本群发送 <strong>@机器人 /check [绑定码]</strong> 即可绑定使用qq频道机器人。</el-text>
    <el-text>之后可以使用机器人的签到和个人信息指令</el-text>
    <el-button bg round link type="success" @click="qqChannel()">点击链接加入QQ频道【test】</el-button>
    <el-text tag="b">绑定服务器：</el-text>
    <el-text>在登录或注册后，在个人信息页即可获得在服务器内的绑定码。限主服可用，使用 <strong>/bind [绑定码]</strong> 即可绑定成功</el-text>
  </el-space>
</template>

<script>
export default {
  methods:{
    qqChannel(){
      window.open('https://pd.qq.com/s/4a6ywgmls');
    }
  }
}
</script>
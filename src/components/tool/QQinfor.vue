<template>
  <t-space direction="vertical">
    <t-space>
      <t-input v-model="input" label="QQ:"/>
      <t-button @click="GetUinInfor">搜索</t-button>
    </t-space>

    <t-card hover-shadow :title="name" :description="sign" headerBordered :loading="loading">
      <template #avatar>
        <t-badge dot :color="onlineColor">
          <t-avatar
              :image="avatar"
              size="50px"
              shape="round"
          ></t-avatar>

        </t-badge>

      </template>
      <t-space direction="vertical" :size="7">
        <div>账号:{{ UIN }}</div>
        <div>等级:{{ levelString }}[{{ grade }}级]</div>
        <div>性别：{{ gender }}</div>
        <div>年龄：{{ age }}</div>
        <div>生日:{{ Birthday }}</div>
        <div>空间动态:{{ dynamic }}</div>
        <div>赞：{{ praise }}</div>
        <div>连续在线天数：{{ ContinuousOnlineDays }}</div>
        <div>在线描述：{{ onlineDescription }}</div>
      </t-space>


    </t-card>
  </t-space>


</template>

<script setup>

import axios from "axios";
import {ref, reactive, onMounted} from "vue";
import QQlevel from 'qqlevel';

const level = new QQlevel();
let levelString = level.outputLevelString(0);
let loading = ref(false);


const input = ref('');
let name = ref('');
let UIN = ref('');
let grade = ref('');
let gender = ref('');
let age = ref('');
let Birthday = ref('');
let dynamic = ref('');
let sign = ref('');
let signatureTime = ref('');
let praise = ref('');
let ContinuousOnlineDays = ref('');
let avatar = ref('');
let onlineDescription = ref('');
let onlineType = ref('')
let onlineColor = ref("#CCCCCC")


onMounted(() => {//本地钩子
  input.value = localStorage.getItem('Uin')//本地缓存
  if (input.value != null) {
    GetUinInfor()
  }
})

function GetUinInfor() {
  localStorage.setItem('Uin', input.value)
  loading = true;
  axios.get("http://106.52.154.251:8585/SummaryCard?Uin=" + input.value + "&token=123456")
      .then(function (response) {
        name.value = response.data ["data"]["昵称"];
        UIN.value = response.data ["data"]["账号"];
        grade.value = response.data ["data"]["等级"];
        gender.value = response.data ["data"]["性别"];
        age.value = response.data ["data"]["年龄"];
        Birthday.value = response.data ["data"]["生日"];
        dynamic.value = response.data ["data"]["空间动态"];
        sign.value = response.data ["data"]["签名"];
        signatureTime.value = response.data ["data"]["签名时间"];
        praise.value = response.data ["data"]["赞"];
        ContinuousOnlineDays.value = response.data ["data"]["连续在线天数"];
        levelString = level.outputLevelString(grade.value);
        avatar.value = "https://q2.qlogo.cn/headimg_dl?dst_uin=" + input.value + "&spec=3"
        if (gender.value == "0") {
          gender.value = "男"
        } else if (gender.value == "1") {
          gender.value = "女"
        } else {
          gender.value = "未知"
        }

      })
  axios.get("http://106.52.154.251:8585/Get_user_online?Uin=" + input.value + "&token=123456")
      .then(function (response) {
        onlineDescription.value = response.data["data"]["在线描述"]
        onlineType.value = response.data["data"]["在线类型"]
        if (onlineType.value == "20") {
          onlineColor.value = "#CCCCCC"
        } else if (onlineType.value == "50") {
          onlineColor.value = "#FFFF00"
        } else {
          onlineColor.value = "#00A870"
        }
      })
  loading = false;


}

</script>

<style scoped>

</style>
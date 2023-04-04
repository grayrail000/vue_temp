<template>
  <t-space direction="vertical">
    <t-radio-group v-model="select" variant="default-filled">
      <t-radio-button value="default">默认模式</t-radio-button>
      <t-radio-button value="Simple">
        <t-popup content="已经开启的辅助权限的账号"> 简单模式</t-popup>
      </t-radio-button>
    </t-radio-group>


    <t-space v-if="select==='default'" direction="vertical" style="width: 350px">
      <t-textarea v-model="input" :autosize="{ minRows: 3}" placeholder="账号----密码----GUID"/>
    </t-space>

    <t-space v-else direction="vertical" style="width: 350px">
      <t-textarea v-model="input" :autosize="{ minRows: 1}" placeholder="账号"/>
      <li>账号需要拥有辅助权限</li>
    </t-space>
    <t-button @click="UpGuid">更新</t-button>

    <t-steps layout="vertical" :default-current="1" theme="dot">
      <t-step-item v-for="(item,index) in items" :title="item.key" :content="item.message+'秒'"/>
    </t-steps>
    {{ApiGetNewGuidResS}}
  </t-space>


</template>

<script setup>

import {reactive, ref} from "vue";
import axios from "axios";
import {MessagePlugin} from "tdesign-vue-next";

const select = ref('Simple');//默认模式
const input = ref('')
const items = ref([])//{key: '1', message: 'Foo'}, {key: '2', message: 'Bar'}
const ApiGetNewGuidResS = ref('')


function UpGuid() {
  if (select.value === 'default') {
    MessagePlugin.warning('此模式未开放')
  } else {
    ApiGetNewGuid()
  }

  function ApiUpGuid_de_() {
    let value = input.value.split("----")
    if (value.length < 3) {
      MessagePlugin.warning("请检查传入的数据")
    } else {
      let UIN = value[0];
      let password = value[1];
      let Guid = value[2];
      let TokenA = value[3];
      let url = "http://175.178.114.18:1213/GetNewGuid?UIN=" + UIN + "&Password=" + password + "&GUID=" + Guid + "&NewGuid=E8B66CB82F4B90EC1EDAADE20CC747FD&tokenA=" + TokenA + "&Proxy="
      axios.get(url)
          .then(function (res) {
            console.log(res.data)
          })
    }
  }

  function ApiGetNewGuid() {
    let UIN = input.value
    let message = ref('')

    if (isNaN(UIN)) {
      MessagePlugin.warning('请检查输入的账号信息')
    } else {
      axios
          .get('http://42.192.237.31:5236/GetNewGuid?UIN=' + UIN + '&proxy=')
          .then(function (res) {
            message.value = res.data["message"]
            if (message.value === '请通过查询api查询生成结果') {
              //创建成功了
              ApiGetNewGuidRes(UIN)
            } else {
              MessagePlugin.warning(message.value);
            }
          })

    }


  }


  function ApiGetNewGuidRes(UIN) {
    axios.get("http://42.192.237.31:5236/GetNewGuidRes?UIN=" + UIN)
        .then(function (res) {
          let message = res.data["messages"]
          let status = res.data["status"]
          Add_items(message)
          if (status === 100) {
            ApiGetNewGuidResS.value = res.data
            return
          }
          setTimeout(ApiGetNewGuidRes, 1000, UIN);//这里又重新调用了
        })
        .catch(function (error) {
          console.error(error);
        });
  }
}

function Add_items(message) {
  let index = items.value.findIndex(item => item.key === message)
  if (index === -1) {
    items.value.push({key: message, message: '0'})
  } else {
    //重复
    let message_temp = items.value[index].message
    let message_int = parseInt(message_temp)
    message_int++
    items.value[index].message = message_int.toString()
  }
}


</script>

<style scoped>

</style>
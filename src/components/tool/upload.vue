<template>
<!--  <div style="width: 500px">-->
<!--    <t-upload :request-method="upImp"  placeholder="请上传辅助登陆的二维码" draggable/>-->
<!--    <div style="height: 30px"/>-->
<!--    <t-textarea :autosize="{ minRows: 10}" placeholder="" />-->
<!--  </div>-->

  <t-space style="width: 500px" direction="vertical" >
    <t-row>
      <t-col :span="3" >
        <t-upload :request-method="upImp"  placeholder="请上传辅助登陆的二维码" draggable/>
      </t-col>
    </t-row>
    <t-row>
      <t-col >
        <t-textarea :autosize="{ minRows: 10}" placeholder="" />
      </t-col>
    </t-row>
    <t-button @click="httpTest">测试</t-button>
  </t-space>




</template>

<script setup>
import {reactive, ref} from 'vue'
import {MessagePlugin} from "tdesign-vue-next";
import axios from "axios";
import jsQR from 'jsqr';


const file = ref([]);

function httpTest() {
  console.log('测试');
  return '测试'

}


function upImp(file){
  let data="1234654"
  axios.post("http://127.0.0.1:8080/decode",file.raw)
      .then(function (res){

         if (res.data.messages="解码成功"){
           let code = res.data.data[0].str;
         }else {
         }
        console.log(code);
      })

}
</script>

<style>

</style>
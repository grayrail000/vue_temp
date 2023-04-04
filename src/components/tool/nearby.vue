<template>
  <t-space direction="vertical">
    <t-radio-group v-model="select" variant="default-filled">
      <t-radio-button value="QR">二维码</t-radio-button>
      <t-radio-button value="manual">
        <t-popup content="手动填入cookie"> 手动</t-popup>
      </t-radio-button>
    </t-radio-group>


    <t-space v-if="select==='manual'" direction="vertical" style="width: 350px">
      <t-input v-model="formData.cookie" placeholder="cookie"/>
      <t-button theme="primary" type="submit" @click="onSubmit">查找</t-button>
    </t-space>
    <!--    二维码-->
    <t-space v-if="select==='QR'" direction="vertical" style="width:220px">
      <li>请使用手机QQ扫描二维码</li>
      <li>{{ QRstatus }}</li>
      <img :src="imageSrc">
    </t-space>
    <t-space v-if="select==='ORs'">
      <t-button theme="primary" type="submit" @click="ClearCache">清除缓存</t-button>
    </t-space>


    <!--   下面是展示代码-->
    <t-card v-for="(item, index) in items" hover-shadow :title="item.nick" :description="item.mf_sign">
      <template #avatar>
        <t-badge dot :color="onlineColor">
          <t-avatar
              :image="item.logo_url"
              size="60px"
              shape="round"
          ></t-avatar>
        </t-badge>
      </template>
      <div>
        UIN:{{ item.Uin }}
      </div>

    </t-card>


  </t-space>


</template>

<script setup>


import {onMounted, reactive, ref} from "vue";
import {MessagePlugin} from "tdesign-vue-next";
import axios from "axios";

const select = ref('QR');//默认模式
const formData = reactive({cookie: ''})
const QRstatus = ref('')
const imageSrc = ref('')


let items = ref([])//{key: '1', message: 'Foo'}, {key: '2', message: 'Bar'}

formData.cookie = localStorage.getItem('UinCookie')//本地缓存
onMounted(() => {
  if (select.value === 'QR') {
    //   二维码模式
    let ORcookie = localStorage.getItem('ORcookie')
    if (ORcookie === null) {
      NearbyGetQrCode()//获取二维码
          .then(function (headers) {
            NearbyGetQrRes(headers)//获取结果
                .then(function (Location) {
                  LocationToCookie(Location)//转换cookie
                      .then(function (cookie) {
                        if (cookie['uin'] != null) {
                          localStorage.setItem('ORcookie', JSON.stringify(cookie))
                          GetPeopleNearby(cookie['uin'], cookie['skey'])//获取附近人列表
                          select.value = 'ORs'
                        }else {
                          console.log('未登陆成功')
                        }

                      })

                })
          })
    } else {
      select.value = 'ORs'
      //cookie存在
      ORcookie = JSON.parse(ORcookie)
      GetPeopleNearby(ORcookie['uin'], ORcookie['skey'])//获取附近人列表
    }


  }
})


function ClearCache() {
  localStorage.removeItem('ORcookie')
}

function NearbyGetQrCode() {
  return axios.get('http://127.0.0.1:8000/NearbyGetQrCode', {
    responseType: 'arraybuffer',
  })
      .then(function (r) {
        const imageSrcValue = 'data:image/jpeg;base64,' + btoa(
            new Uint8Array(r.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        imageSrc.value = imageSrcValue
        return r.headers

      })
}


async function NearbyGetQrRes(head) {

  let data = {
    "pt_local_token": head['pt_local_token'],
    "pt_login_sig": head['pt_login_sig'],
    "qrsig": head['qrsig']
  }
  let config = {
    headers: {'Content-Type': 'application/json'}
  };

  let i = 0;
  while (i < 100) {
    try {
      const r = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(axios.post('http://127.0.0.1:8000/NearbyGetQrRes', data, config));
        }, 1000);
      });

      const match = r.data.match(/'([^']*)'/g).map(match => match.slice(1, -1));
      console.log(match);
      QRstatus.value = match[4];
      if (match[0] === '0') {
        //登陆成功了
        return match[2]
        break;
      } else if (match[0] === '66') {
        //二维码未失效
      } else if (match[0] === '67') {
        //二维码认证中
      } else {
        console.log('循环已结束');
      }

      i++;
    } catch (error) {
      console.error(error);
      break;
    }
  }
}


function LocationToCookie(Location) {
  let data = {
    "Location": Location,
  }
  let config = {
    headers: {'Content-Type': 'application/json'}
  };
  return axios
      .post('http://127.0.0.1:8000/LocationToCookie', data, config)
      .then(function (r) {
        return r.data
      })
      .catch(function (error) {
        console.log(error)
      })

}


function onSubmit() {
  items.value = []
  let match = formData.cookie.match(/uin=(\w+); skey=(.\w+)/);
  localStorage.setItem('UinCookie', formData.cookie)
  if (match.length === 3) {
    let uin = match[1];
    let skey = match[2]
  }
}

function GetPeopleNearby(uin, skey) {


  let data = {
    "UIN": uin,
    "skey": skey
  }
  let config = {
    method: 'post',
    url: 'http://124.223.99.117:8000/GetPeopleNearby',
    headers: {'Content-Type': 'application/json'},
    data: data
  };
  axios(config)
      .then(function (res) {
        analyze(res.data)
      })
}


function analyze(data) {
  let json = JSON.parse(data)
  let followList = json.result.follow_list;

  for (let i = 0; i < followList.length; i++) {
    let nick = followList[i].nick;
    let age = followList[i].age;
    let charm_level = followList[i].charm_level;
    let logo_url = followList[i].logo_url;
    let mf_sign = followList[i].mf_sign;
    let Uin = '';
    let index = items.value.push({nick: nick, age: age, logo_url: logo_url, mf_sign: mf_sign, Uin: Uin})
    IdToUin(logo_url, index)
  }
}


function IdToUin(logo_url, index) {
  let extractedString = logo_url.match(/pic.(\w+)/)[1];
  extractedString = extractedString.substring(10, 26);
  axios.get("http://106.52.154.251:81/tinyidToUin?tinyid=" + extractedString + "&token=664725147")
      .then(function (res) {//异步的
        let Uin = res.data["data"]["Uin"]
        index--
        items.value[index].Uin = Uin;
        return Uin;
      })
}


</script>

<style scoped>

</style>
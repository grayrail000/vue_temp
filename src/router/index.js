import {createRouter, createWebHistory} from "vue-router";
import QQinfo from "@/components/tool/QQinfor.vue";
import UpGuid from "@/components/tool/UpGuid.vue";
import nearby from "@/components/tool/nearby.vue";
import upload from "@/components/tool/upload.vue";
import head from "@/components/tool/head.vue";
import home from "@/components/tool/home.vue";
import explanation from "@/components/explanation.vue";

const routes = [{
    path: "/tool",
    component: home,
    children: [
        {path: "", component: head, meta: {title: "首页", icon: "app"}},
        {path: "QQinfo", component: QQinfo, meta: {title: "信息", icon: "precise-monitor"}},
        {path: "UpGuid", component: UpGuid, meta: {title: "更新GUID", icon: "refresh"}},
        {path: "nearby", component: nearby, meta: {title: "附近人", icon: "usergroup"}},
        {path: 'upload', name: 'upload', component: upload, meta: {title: '上传', icon: 'root-list'}},
    ]
},
    { path: '/', component: explanation },
]




const router = createRouter({ //创建路由器
    history: createWebHistory(import.meta.env.BASE_URL),//创建网络历史记录
    // location / {
    // try_files $uri $uri/ /index.html;}
    ///此方法服务器需要设置伪静态
    routes
})

export default router
import { createApp } from 'vue'
import App from './App.vue'
import TDesign from 'tdesign-vue-next';
import router from './router'
// 引入组件库全局样式资源

//import './assets/main.css'
import 'tdesign-vue-next/es/style/index.css';

const app = createApp(App);
app.use(router)
app.use(TDesign);


app.mount('#app');




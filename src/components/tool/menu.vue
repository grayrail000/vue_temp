<template>
  <t-menu :default-Value="defaultValue">
    <t-menu-item
        v-for="(item, index) in Routeslist"
        :value="'/tool/' + item.path"
        :to="'/tool/' + item.path"
        :key="index">
      <template #icon>
        <t-icon :name='item.meta.icon'/>
      </template>
      {{ item.meta.title }}
    </t-menu-item>
  </t-menu>
</template>

<script setup>
import routes from '@/router'
import {onMounted, ref} from "vue";
let Routeslist = routes.options.routes[0].children//菜单里面的路由
const defaultValue = routes.options.history.location

onMounted(() => {
  console.log(Routeslist)
})

</script>

<style scoped>

</style>
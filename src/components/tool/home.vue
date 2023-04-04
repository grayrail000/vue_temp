<template>
    <div class="container">
      <div class="A">
        <menuL></menuL>
      </div>
      <div class="B">
        <router-view></router-view>
      </div>
    </div>

</template>

<script setup>
import menuL from "@/components/tool/menu.vue";

</script>

<style scoped>

.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-auto-columns: 1fr;
  grid-auto-rows: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "A B .";
}

.A {
  grid-area: A;
}

.B {
  grid-area: B;
  margin-top: 50px;
}
</style>
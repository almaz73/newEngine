<template>
  <el-menu
      default-active="3"
      class="el-menu-vertical"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"


  >
    <div :style="{width:isCollapse?'72px':'216px'}" style="background: red; height: 72px; transition: width">
      <img src="@/assets/img/small-logo.png" style="width: 100%; height: 72px" v-if="isCollapse"/>
      <img src="@/assets/img/big-logo.jpg" style="width: 100%; height: 72px" v-if="!isCollapse"/>
    </div>

    <el-menu-item index="2">
      <el-icon><img src="../assets/icons/ic-desktop-windows-black-18-px.png" height="34" width="34"/></el-icon>
      <template #title>Рабочий стол</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><img src="../assets/icons/ic-people-black-18-px.png" height="34" width="34"/></el-icon>
      <template #title>Обращения</template>
    </el-menu-item>
    <el-menu-item index="4" @click="isCollapse = !isCollapse">
      <el-icon><img src="../assets/icons/ic-directions-car-black-18-px.png" height="34" width="34"/></el-icon>
      <template #title>Оценки</template>
    </el-menu-item>
    <el-menu-item index="2">
      <el-icon><img src="../assets/icons/ic-home-black-18-px.png" height="34" width="34"/></el-icon>
      <template #title>Склад</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><img src="../assets/icons/ic-call-black-20-px.png" height="34" width="34"/></el-icon>
      <template #title>Звонки</template>
    </el-menu-item>


    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <img src="../assets/icons/ic-settings-black-18-px.png" height="34" width="34"/>
        </el-icon>
        <span>Вложенные меню</span>
      </template>
      <el-menu-item-group title="Group Two"></el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>

    <el-menu-item index="4" @click="isCollapse = !isCollapse">
      <el-icon><img src="../assets/icons/ic-import-export-black-18-px.png" height="34" width="34"/></el-icon>
      <template #title>Управление</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {Document, Menu as IconMenu, Location, Setting} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 215px;
}
</style>
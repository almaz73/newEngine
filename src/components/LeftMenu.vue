<template>
  <div class="left-menu-logo" :class="{'small':isCollapse}" @click="isCollapse = !isCollapse"></div>

  <div class="left-menu-div" :class="{'narrow':isCollapse}">
    <el-menu
        default-active="3"
        class="el-menu-vertical"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
    >

      <el-menu-item index="1">
        <el-icon><img src="../assets/icons/ic-desktop-windows-black-18-px.png"/></el-icon>
        <template #title>Рабочий стол</template>
      </el-menu-item>

      <el-menu-item index="2">
        <el-icon><img src="../assets/icons/ic-people-black-18-px.png"/></el-icon>
        <template #title>Обращения</template>
      </el-menu-item>

      <el-menu-item index="3">
        <el-icon><img src="../assets/icons/ic-directions-car-black-18-px.png"/></el-icon>
        <template #title>Оценки</template>
      </el-menu-item>

      <el-menu-item index="4">
        <el-icon><img src="../assets/icons/ic-home-black-18-px.png"/></el-icon>
        <template #title>Склад</template>
      </el-menu-item>

      <el-menu-item index="5" disabled>
        <el-icon><img src="../assets/icons/ic-call-black-20-px.png"/></el-icon>
        <template #title>Звонки</template>
      </el-menu-item>

      <el-sub-menu index="6">
        <template #title>
          <el-icon>
            <img src="../assets/icons/ic-settings-black-18-px.png"/>
          </el-icon>
          <span>Вложенные меню</span>
        </template>
        <el-menu-item-group title="Group Two"></el-menu-item-group>
        <el-sub-menu index="6-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="6-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>

      <el-menu-item index="7">
        <el-icon><img src="../assets/icons/ic-import-export-black-18-px.png"/></el-icon>
        <template #title>Управление</template>
      </el-menu-item>

      <el-menu-item index="8">
        <el-icon><img src="../assets/icons/ic-done-all-black-18-px.png"/></el-icon>
        <template #title>Cобытия</template>
      </el-menu-item>

      <el-menu-item index="9">
        <el-icon><img src="../assets/icons/ic-trending-up-black-18-px.png"/></el-icon>
        <template #title>Аналитика</template>
      </el-menu-item>

      <el-menu-item index="10">
        <el-icon><img src="../assets/icons/icon-plan-indicator.png"/></el-icon>
        <template #title>Плановые показатели</template>
      </el-menu-item>

      <el-menu-item index="11">
        <el-icon><img src="../assets/icons/ic-account-balance-black-18-px.png"/></el-icon>
        <template #title>Заявки на кредит</template>
      </el-menu-item>

      <el-menu-item index="12">
        <el-icon><img src="../assets/icons/ic-shopping-cart-black-18-px.png"/></el-icon>
        <template #title>Реализация</template>
      </el-menu-item>

      <el-menu-item index="13">
        <el-icon><img src="../assets/icons/icon-insurance-policies.png"/></el-icon>
        <template #title>Страховые полисы</template>
      </el-menu-item>

      <el-menu-item index="14">
        <el-icon><img src="../assets/icons/icon-equip.png"/></el-icon>
        <template #title>Доп.оборудование</template>
      </el-menu-item>

      <el-menu-item index="15">
        <el-icon><img src="../assets/icons/icon-reports.png"/></el-icon>
        <template #title>отчеты</template>
      </el-menu-item>

      <el-menu-item index="16">
        <el-icon><img src="../assets/icons/ic-chat-black-18-px.png"/></el-icon>
        <template #title>Новости</template>
      </el-menu-item>

      <el-menu-item index="17">
        <el-icon><img src="../assets/icons/ic-system-inactive.png"/></el-icon>
        <template #title>Система</template>
      </el-menu-item>

      <el-menu-item index="18">
        <el-icon><img src="../assets/icons/ic-help-red-18-px.png" height="34" width="34"/></el-icon>
        <template #title>Помощь</template>
      </el-menu-item>

      <el-menu-item index="19">
        <el-icon><img src="../assets/icons/icon-questionnaires.png" height="34" width="34"/></el-icon>
        <template #title>Анкеты</template>
      </el-menu-item>
    </el-menu>
  </div>

  <div class="left-menu-opener" :class="{'small':isCollapse}" @click="isCollapse = !isCollapse">
    <div v-if="!isCollapse">
      <img src="../assets/img/left-toggle-arrow.png" height="10" width="16"/>
      <span> &nbsp; &nbsp; Свернуть меню &nbsp; </span>
    </div>
    <div v-else>
      <img src="../assets/img/right-toggle-arrow.png" height="16" width="16"/>
    </div>
  </div>
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
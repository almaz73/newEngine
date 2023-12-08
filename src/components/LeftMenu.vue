<template>
  <div class="left-menu-logo" :class="{'small':globalStore.isNarrowPanel, 'show': globalStore.isShowPanel}"
       @click="globalStore.isShowPanel=false"></div>

  <div class="left-menu-div" :class="{'narrow':globalStore.isNarrowPanel, 'show': globalStore.isShowPanel}">
    <el-menu
        default-active="1"
        class="el-menu-vertical"
        :collapse="globalStore.isNarrowPanel"
        @select="select"
        popper-effect="light"
    >
      <RouterLink to="/desktop">
        <el-menu-item index="1">
          <el-icon><img alt="Рабочий стол" src="../assets/icons/ic-desktop-windows-black-18-px.png"/></el-icon>
          <template #title>Рабочий стол</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/appeal">
        <el-menu-item index="2">
          <el-icon><img alt="Обращения" src="../assets/icons/ic-people-black-18-px.png"/></el-icon>
          <template #title>Обращения</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/deal">
        <el-menu-item index="3">
          <el-icon><img alt="Оценки" src="../assets/icons/ic-directions-car-black-18-px.png"/></el-icon>
          <template #title>Оценки</template>
        </el-menu-item>
      </RouterLink>

      <el-menu-item index="4">
        <el-icon><img alt="Склад" src="../assets/icons/ic-home-black-18-px.png"/></el-icon>
        <template #title>Склад</template>
      </el-menu-item>

      <el-menu-item index="5" disabled>
        <el-icon><img alt="Звонки" src="../assets/icons/ic-call-black-20-px.png"/></el-icon>
        <template #title>Звонки</template>
      </el-menu-item>

      <el-sub-menu index="6">
        <template #title>
          <el-icon>
            <img alt="Вложенные меню" src="../assets/icons/ic-settings-black-18-px.png"/>
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
        <el-icon><img alt="Управление" src="../assets/icons/ic-import-export-black-18-px.png"/></el-icon>
        <template #title>Управление</template>
      </el-menu-item>

      <el-menu-item index="8">
        <el-icon><img alt="Cобытия" src="../assets/icons/ic-done-all-black-18-px.png"/></el-icon>
        <template #title>Cобытия</template>
      </el-menu-item>

      <el-menu-item index="9">
        <el-icon><img alt="Аналитика" src="../assets/icons/ic-trending-up-black-18-px.png"/></el-icon>
        <template #title>Аналитика</template>
      </el-menu-item>

      <RouterLink to="/ideas">
        <el-menu-item index="10">
          <el-icon><img alt="Плановые показатели" src="../assets/icons/icon-plan-indicator.png"/></el-icon>
          <template #title>::::::::: По новому дизайну ::::::::</template>
        </el-menu-item>
      </RouterLink>

      <el-menu-item index="11">
        <el-icon><img alt="Заявки на кредит" src="../assets/icons/ic-account-balance-black-18-px.png"/></el-icon>
        <template #title>Заявки на кредит</template>
      </el-menu-item>

      <el-menu-item index="12">
        <el-icon><img alt="Реализация" src="../assets/icons/ic-shopping-cart-black-18-px.png"/></el-icon>
        <template #title>Реализация</template>
      </el-menu-item>

      <el-menu-item index="13">
        <el-icon><img alt="Страховые полисы" src="../assets/icons/icon-insurance-policies.png"/></el-icon>
        <template #title>Страховые полисы</template>
      </el-menu-item>

      <el-menu-item index="14">
        <el-icon><img alt="Доп.оборудование" src="../assets/icons/icon-equip.png"/></el-icon>
        <template #title>Доп.оборудование</template>
      </el-menu-item>

      <el-menu-item index="15">
        <el-icon><img alt="отчеты" src="../assets/icons/icon-reports.png"/></el-icon>
        <template #title>отчеты</template>
      </el-menu-item>

      <el-menu-item index="16">
        <el-icon><img alt="Новости" src="../assets/icons/ic-chat-black-18-px.png"/></el-icon>
        <template #title>Новости</template>
      </el-menu-item>

      <el-menu-item index="17">
        <el-icon><img alt="Система" src="../assets/icons/ic-system-inactive.png"/></el-icon>
        <template #title>Система</template>
      </el-menu-item>
      <RouterLink to="/desktop">
        <el-menu-item index="18">
          <el-icon><img alt="Помощь" src="../assets/icons/ic-help-red-18-px.png"/></el-icon>
          <template #title>Помощь</template>
        </el-menu-item>
      </RouterLink>

      <el-menu-item index="19">
        <el-icon><img alt="Анкеты" src="../assets/icons/icon-questionnaires.png" height="34" width="34"/></el-icon>
        <template #title>Анкеты</template>
      </el-menu-item>
    </el-menu>
  </div>

  <div class="left-menu-opener" :class="{'small':globalStore.isNarrowPanel}"
       @click="globalStore.isNarrowPanel = !globalStore.isNarrowPanel">
    <div v-if="!globalStore.isNarrowPanel">
      <img alt="" src="../assets/img/left-toggle-arrow.png" height="10" width="16"/>
      <span> &nbsp; &nbsp; Свернуть меню &nbsp; </span>
    </div>
    <div v-else>
      <img alt="" src="../assets/img/right-toggle-arrow.png" height="16" width="16"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useGlobalStore} from "@/stores/globalStore";

const globalStore = useGlobalStore()
const select = () => globalStore.isShowPanel = false

window.addEventListener('resize', () => globalStore.isNarrowPanel = true)
</script>
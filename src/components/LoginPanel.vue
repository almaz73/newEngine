<template>
  <div class="account_window">
    <div class="account_window__content">
      <img alt="photo" class="account_window__photo" :src="loginPhotoSrc"/>
      <div class="account_window__text">
        <img class="settings"
             alt=""
             @click="router.push('/sets'); emits('closeLoginPanel')"
             src="@/assets/icons/icon-management-active.png">


        <div style="margin-right: 25px">
          {{ globalStore.account.lastName }} {{ globalStore.account.firstName }}
        </div>

        <div>{{ globalStore.account.roleTitle }}</div>
        <div>{{ globalStore.account.orgElementName }}</div>
        <button
            v-if="globalStore.account.lastName==='Файзрахманов'"
            style="position: absolute; right: 15px" @click="openCounterPage()">☈</button>
        <div>{{ globalStore.account.storage }}</div>
      </div>
    </div>
    <div class="account_window__buttons">
      <el-button class="edit" @click="edit()">Редактировать</el-button>
      <el-button class="exit" @click="signOut()">Выйти</el-button>
    </div>
    <div class="account_window__buttons">
      <span>ver : {{ globalStore.version }}
        <RouterLink to="/version" @click="emits('closeLoginPanel'); EventBus.emit('changeMenu', '73')">
          more..
        </RouterLink>
      </span>

    </div>
    <div class="account_window__buttons">
      <RouterLink to="/feedback"
                  @click="emits('closeLoginPanel')">
        ➽ Страница обратной связи
      </RouterLink>
    </div>
    <div class="under_window" @click="emits('closeLoginPanel')"></div>
  </div>
  <UsersDirModal ref="UserModal"/>
</template>
<style>
.settings {
  position: absolute;
  right: 16px;
  cursor: pointer;
}

</style>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import router from "@/router";
import EventBus from '@/utils/eventBus'
import UsersDirModal from "@/pages/admin/dirs/UsersDirModal.vue";
import {computed, ref} from "vue";


const emits = defineEmits(['closeLoginPanel'])
const globalStore = useGlobalStore()
const UserModal = ref(null)
const loginPhotoSrc = computed(()=>globalStore.account.avatarUrl || "/v2/src/assets/icons/icon-face.png")

function signOut() {
  globalStore.isWaiting = true
  localStorage.removeItem('LastReport')
  localStorage.removeItem('AdminDirectories')
  globalStore.signOut().then(() => {
    localStorage.removeItem('account')
    globalStore.isAuthorized = false
    globalStore.isWaiting = false
    router.push('login')
  })
}

function openCounterPage() {
  // счетчик посещений
  window.open("http://dev.autonet.pro/#/appeal/"+globalStore.appealIdForShowCounter)
}

function edit() {
  UserModal.value.open({id:globalStore.account.id})
}
</script>
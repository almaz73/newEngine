<template>
  <div>
    <img src="@/assets/img/loading.gif"
         alt=""
         v-if="globalStore.isWaiting"
         class="waiter"
    />
    <form class="login">
      <img alt="" src="@/assets/icons/logo-gray.png" height="42">
      <h1>Авторизация</h1>
      <input type="text"
             placeholder="Логин"
             name="login"
             autocomplete="off"
             v-model="login">
      <span class="passwors">
        <input type="password"
               placeholder="Пароль"
               name="password"
               v-model="password">
        <img alt="" src="@/assets/icons/icon-password.png">
      </span>
      <input type="button"
             value="Войти"
             @click.prevent="signIn()">
      <div class="danger">{{ authMessage }}</div>

    </form>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";

const globalStore = useGlobalStore()
const login = ref('')
const password = ref('')
const authMessage = ref('')

function goMyFirstPage(role: string) {
  switch (role) {
    case "Admin":
      location.replace("/v2/deal")
      break
    case "Hostess":
      location.replace("/v2/hostess")
      break
    case "CallManager":
      location.replace("/v2/appeal")
      break
    case "PsmManager":
      location.replace("/v2/sell")
      break
    default:

      location.replace("/v2/desktop")
  }
}

function signIn(): void {
  globalStore.isWaiting = true
  globalStore.signIn(login.value, password.value).then(res => {
    switch (res.request.status) {
      case 401:
        authMessage.value = 'Неверное имя пользователя или пароль';
        break
      case 403:
        authMessage.value = 'Пользователь заблокирован';
        break
      case 200:
        globalStore.isWaiting = false
        globalStore.isAuthorized = true
        goMyFirstPage(res.data.role)
        break;
      default:
        authMessage.value = 'Произошла ошибка';
        if (res.request.statusText) authMessage.value = 'Произошла ошибка: ' + res.request.statusText;
    }

    globalStore.account = res.data
    globalStore.account.dateTime = String(Date.now())
    localStorage.setItem('account', JSON.stringify(res.data))
  })
}
</script>
<template>
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
</template>
<script setup lang="ts">
import {ref} from "vue";
import router from "@/router";
import {useGlobalStore} from "@/stores/globalStore";

const globalStore = useGlobalStore()
const login = ref('')
const password = ref('')
const authMessage = ref('')

function signIn(): void {
  globalStore.signIn(login.value, password.value).then(res => {
    switch (res.request.status) {
      case 401:
        authMessage.value = 'Неверное имя пользователя или пароль';
        break
      case 403:
        authMessage.value = 'Пользователь заблокирован';
        break
      case 200:
        globalStore.isAuthorized = true
        router.push(globalStore.oldPath ? globalStore.oldPath : '/deal')
        globalStore.oldPath = ''
        break;
      default:
        authMessage.value = 'Произошла ошибка';
        if (res.request.statusText) authMessage.value = 'Произошла ошибка: ' + res.request.statusText;
    }

    globalStore.account = res.data
    localStorage.setItem('account', JSON.stringify(res.data))
  })
}
</script>
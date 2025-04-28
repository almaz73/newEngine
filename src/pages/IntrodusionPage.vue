<template>
  <main style="margin: 8px">

    <br>

    <div style="border: 5px double #ccc; padding: 30px">
      <el-radio-group v-model="textButtons" @click="toggleDark();themeChanged()">
        <el-radio-button value="Светлая тема">Темная тема</el-radio-button>
        <el-radio-button value="Темная тема">Светлая тема</el-radio-button>
      </el-radio-group>
      <span> &nbsp; &nbsp; &nbsp; &nbsp; Для темной темы удобнее использвоать расширение браузера
        <a href="https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh?hl=ru&pli=1">Dark Reader</a>
      </span>

      <br><br>
      <el-button @click="clearCash()">Очистить кэш</el-button> Удаляет все cookies, localStorage, sessionStorage
    </div>
    <br>

    <div style="border: 5px double #ccc; padding: 30px" v-if="permit()">
      <small style="color: #999">* видно только админам</small>
      <br><br>
      <p>
        <RouterLink to="/myView">Видение развития веб-направления</RouterLink>
        <br><br><br>
        <RouterLink to="/ideas">Идеи по редизайну</RouterLink>
      </p>

      <h4>Инструкции по работе</h4>
      <p>
        <RouterLink to="/bayerhelp">Инструкция. Байер</RouterLink>
      </p>
    </div>

  </main>
</template>

<script setup>
import { useGlobalStore } from '@/stores/globalStore'
import { useDark, useToggle } from '@vueuse/core'
import { ref } from 'vue'
import { permit } from '@/utils/permit'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const textButtons = ref()

function themeChanged() {
  textButtons.value = isDark.value ? 'Светлая тема' : 'Темная тема'
}

function clearCash() {
  localStorage.clear()
  sessionStorage.clear()


  // удаление всеx cookie
  var cookies = document.cookie.split("; ");
  for (var c = 0; c < cookies.length; c++) {
    var d = window.location.hostname.split(".");
    while (d.length > 0) {
      var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
      var p = location.pathname.split('/');
      document.cookie = cookieBase + '/';
      while (p.length > 0) {
        document.cookie = cookieBase + p.join('/');
        p.pop();
      }
      d.shift();
    }
  }

}

themeChanged()
useGlobalStore().setTitle('Введение')
</script>
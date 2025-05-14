<!--Для быстрого переключения между ролями-->

<template>
  <div style="cursor:pointer; border: 8px double #999; padding: 12px">
    <div @click="openAs">Хостес</div>
    <br>
    <div @click="openAs">Управляющий</div>
    <br>
    <div @click="openAs">Продажник оформитель</div>
    <br>
    <div @click="openAs">Колл-центр: сотрудник</div>
    <div @click="openAs">Колл-центр: менеджер</div>
    <br>
    <div @click="openAs">Продажи сотрудник</div>
    <div @click="openAs">Продажи менеджер</div>
    <br>
    <div @click="openAs">Выкупщик сотрудник</div>
    <div @click="openAs">Выкупщик менеджер</div>
    <br>
    <div @click="openAs">Аналитик сотрудник</div>
    <div @click="openAs">Аналитик менеджер</div>
  </div>
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore.ts";

const globalStore = useGlobalStore()

function openAs(val) {
  console.log('val = ', val.target.innerText)

  let login = ''
  let pass = 'qwerty123'
  switch (val.target.innerText) {
    case 'Хостес':
      login = 'd.afzalova'
      //Hostess
      break;
    case 'Управляющий':
      login = 'm.verhotina'
      //GenManager
      break;
    case 'Продажник оформитель':
      login = 't.avramenko'
      // Agent
      break;
    case 'Колл-центр: сотрудник':
      // CallEmployee
      login = 'r.altinbeva'
      break;
    case 'Колл-центр: менеджер':
      // CallManager
      login = 'g.babaeva'
      break;
    case 'Продажи сотрудник':
      // SalesEmployee
      login = 'a.aynutdinov'
      break;
    case 'Продажи менеджер':
      // SalesManager
      login = 's.antipin'
      break;
    case 'Выкупщик сотрудник':
      // BuyerEmployee
      login = 'd.abzalov'
      break;
    case 'Выкупщик менеджер':
      // BuyerManager
      login = 'aleksey'
      break;
    case 'Аналитик сотрудник':
      // AnalystEmployee
      login = 'a.ahmetov'
      break;
    case 'Аналитик менеджер':
      // AnalystManager
      login = 'r.garaev2'
      break;

  }

  globalStore.isWaiting = true
  globalStore.signIn(login, pass).then(res => {
    globalStore.isWaiting = false
    globalStore.isAuthorized = true
    localStorage.setItem('account', JSON.stringify(res.data))
    location.replace("/v2/desktop")
  })
}
</script>
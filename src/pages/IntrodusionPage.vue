<template>
  <main>

    <br>

    <div style="border: 5px double #ccc; padding: 30px">
      <el-radio-group v-model="textButtons" @click="toggleDark();themeChanged()">
        <el-radio-button label="Светлая тема"/>
        <el-radio-button label="Темная тема"/>
      </el-radio-group>
    </div>
    <p>
      <RouterLink to="/ideas">Накоплено</RouterLink>
      - Идеи по редизайну
    </p>
    <p>
      <a href="https://g66.ru/almaz73/" title="Оставить замечания, предложения, идеи">
        Task Board</a> - Доска замечаний и предложений
    </p>

    <br>
    <h4>Инструкции по работе</h4>
    <i> Хотелось бы для всех пользователей написать простую(для оазработки) а затем подробную инструкцию(для пользователя) <br>
      Понимание этих процессов ускорит разработку, позволит по очереди завершать работу для отдельных ролей </i>
    <p>
      <RouterLink to="/bayerhelp">Инструкция. Байер</RouterLink>
    </p>

  </main>
</template>

<script setup>
import {useGlobalStore} from "@/stores/globalStore";
import {useDark, useToggle} from '@vueuse/core'
import {ref} from "vue";

const isDark = useDark()
const toggleDark = useToggle(isDark)
const textButtons = ref()

function themeChanged() {
  textButtons.value = isDark.value ? "Темная тема" : "Светлая тема"
}

themeChanged()
useGlobalStore().setTitle('Введение')
</script>
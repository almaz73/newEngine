<template>
  <main>

    <br>

    <div style="border: 5px double #ccc; padding: 30px">
      <el-radio-group v-model="textButtons" @click="toggleDark();themeChanged()">
        <el-radio-button label="Светлая тема"/>
        <el-radio-button label="Темная тема"/>
      </el-radio-group>
    </div>
    <br>
    <p>
      <RouterLink to="/myView"><h2>Как я вижу развитие веб-направления</h2></RouterLink>
      <br><br><br>
      <RouterLink to="/ideas">Идеи по редизайну</RouterLink>
    </p>

    <br>
    <h4>Инструкции по работе</h4>
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
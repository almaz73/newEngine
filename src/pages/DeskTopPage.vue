<template>
  <main>
    <div class="canvas">

      <el-button-group v-model="leadType" class="group-button">
        <div>Клиент</div>
        <br>
        <el-button @click="leadType=10"
                   :class="{active:leadType==10}"> Физ.лицо
        </el-button>
        <el-button @click="leadType=20"
                   :class="{active:leadType==20}"> Юр.лицо
        </el-button>
      </el-button-group>

      <div class="fields">
        <div v-if="leadType==10">Юридическое лицо</div>
        <div v-if="leadType==20">Физическое лицо</div>
        <br>
        <input placeholder="Основной телефон">
        <input placeholder="Подменный телефон">
        <input placeholder="Эл.почта">
        <input placeholder="Имя">
        <input placeholder="Отчество">
        <input placeholder="Фамилия">
      </div>
    </div>
  </main>
</template>
<style>
.canvas {
  background: white;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.dark .canvas {
  background: black;
}

.group-button {
  width: 200px
}

.group-button button {
  width: 180px;
  opacity: 0.4;
}

@media (width < 500px) {
  .group-button {
    width: 120px;
  }

  .group-button button {
    width: 120px;
    opacity: 0.4;
  }
}

.fields {
  width: 180px;
}

.group-button button.active {
  color: white !important;
  opacity: 1;
  background: #6d6d6d !important;
  position: relative;
}

.group-button button.active::after {
  content: '';
  position: absolute;
  right: -7px;
  top: 9px;
  border-top: 7px solid transparent;
  border-left: 7px solid #6d6d6d;
  border-bottom: 7px solid transparent;
}

</style>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";

const globalStore = useGlobalStore()
const leadType = ref(20)

globalStore.setTitle('Новое обращение')
globalStore.steps = []
</script>
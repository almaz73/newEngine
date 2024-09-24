<template>
  <div>
    <el-icon :style="{color: item.isMileageOriginal?'green':'orange'}">
      <RemoveFilled />
    </el-icon> &nbsp;

    <span>Пробег</span>

    <div
      style="float: right; cursor: pointer"
      @click="changeItem(item.isMileageOriginal)"
      @mouseover="item.isMileageOriginal=!item.isMileageOriginal"
      @mouseleave="toMouseLeave(item, 'isMileageOriginal')">
      <el-button
        :type="!item.isMileageOriginal?'warning':'success'"
        style="width: 150px; pointer-events:none">
        <span>  {{ item.isMileageOriginal ? 'Родной' : 'Изменен' }}</span>
      </el-button>
    </div>


    <div v-if="isSHow">
      <div v-if="item.additionalAutoInfo.mileageAuto != undefined">ориентировочно</div>
      <div v-if="item.additionalAutoInfo.mileageAuto == 0 || item.additionalAutoInfo.mileageAuto == null"> надо
        указать
      </div>
      <el-input v-model="dealStore.deal.additionalAutoInfo.mileageAuto" />
    </div>

    <div style="float: right; cursor: pointer"></div>

    <el-divider />

    <div> Категория автомобиля
      <div style="float: right; display: flex" class=" category-auto_bt">
        <div class="category-auto" :style="{background:number===1?'#518468':'#ddd'}" @click="clk(1)"> А</div>
        <div class="category-auto" :style="{background:number===2?'#c6e0cc':'#ddd'}" @click="clk(2)"> B</div>
        <div class="category-auto" :style="{background:number===3?'orange':'#ddd'}" @click="clk(3)"> C</div>
        <div class="category-auto" :style="{background:number===4?'#848484':'#ddd'}" @click="clk(4)"> D</div>
        <div class="category-auto" :style="{background:number===5?'#d84e4e':'#ddd'}" @click="clk(5)"> S</div>
      </div>

    </div>

    <el-divider />


  </div>

</template>

<script setup lang="ts">
import { useDealStore } from '@/stores/dealStore'
import { RemoveFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'

const dealStore = useDealStore()
const chapok = ref(false)
const isSHow = ref(false)
const number = ref(3)
const item = ref({})

item.value = dealStore.deal
isSHow.value = !item.value.additionalAutoInfo.isMileageOriginal
number.value = item.value.auto.categoryAuto

function clk(category) {
  number.value = category
  dealStore.deal.auto.categoryAuto = category
}

function changeItem(state) {
  chapok.value = true
  item.value.additionalAutoInfo.isMileageOriginal = state
  isSHow.value = !item.value.additionalAutoInfo.isMileageOriginal
}

function toMouseLeave(item: any, type: string) {
  if (!chapok.value) {
    if (type === 'isMileageOriginal') item.isMileageOriginal = !item.isMileageOriginal
  }
  chapok.value = false
}

</script>
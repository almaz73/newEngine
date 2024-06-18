<template>
  <div class="filter-button">
    <el-button  type="info" v-for="(b, ind) in buttons"
               :key="ind" @click="clicked(b.code)"
               :class="{ active: activeButton === b.code }">
      {{ b.name }} {{ b.count }}
    </el-button>

  </div>
  <div class="a-search custom" :style="searchInputStyle">
    <input
        type="search"
        :placeholder="placeholder"
        name="vin"
        v-model="text"
        @input="emits('updateSearchText', text)"
        @keyup.enter="emits('getData')"
    />
    <el-button @click.prevent="emits('openFilter')" type="info">
      <img
          alt=""
          class="filter-button"
          :class="{ open: isOpen }"
          src="@/assets/icons/icon-menu-arrow-down.png"
      />
    </el-button>
    <el-button :icon="PieChart" @click="emits('openChart')" v-if="props.isShowChart"/>

    <el-button @click="emits('add')"
               v-if="props.isShowAdd"
               type="danger" :icon="Plus"> Добавить</el-button>
  </div>
</template>
<script setup>
import {computed, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {PieChart, Plus} from "@element-plus/icons-vue";

const text = ref('')
const emits = defineEmits(['buttonFilterSelect', 'openFilter', 'updateSearchText', 'getData', 'openChart', 'add'])
const props = defineProps(['buttons', 'isOpen', 'placeholder', 'isShowChart', 'isShowAdd'])
const buttons = props.buttons
const activeCode = buttons.length && buttons.find(el => el.active).code
const activeButton = ref(activeCode)

if (!buttons.length) console.warn('Внимание : Нет кнопок над фильтрами:::')


const searchInputStyle = computed(() => {
  return useGlobalStore().isMobileView ? {textAlign: 'center'} : {float: 'right'}
})

function clicked(code) {
  activeButton.value = code
  emits('buttonFilterSelect', code)
}


</script>
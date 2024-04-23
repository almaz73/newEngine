<template>
  <div class="filter-button">
    <el-button v-for="(b, ind) in buttons"
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
    <el-button @click.prevent="emits('openFilter')">
      <img
          alt=""
          class="filter-button"
          :class="{ open: isOpen }"
          src="@/assets/icons/icon-menu-arrow-down.png"
      />
    </el-button>
    <el-button :icon="PieChart" @click="emits('openChart')" v-if="props.isShowChart"/>
  </div>
</template>
<script setup>
import {computed, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {PieChart} from "@element-plus/icons-vue";

const text = ref('')
const emits = defineEmits(['buttonFilterSelect', 'openFilter', 'updateSearchText', 'getData', 'openChart'])
const props = defineProps(['buttons', 'isOpen', 'placeholder', 'isShowChart'])
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
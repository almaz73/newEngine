<template>
  <div class="filter-button">
    <el-button v-for="(b, ind) in buttons"
               :key="ind" @click="clicked(b.code)"
               :class="{ active: activeButton === b.code }">
      {{ b.name }} {{ b.count }}
    </el-button>

  </div>
  <div class="a-search" :style="searchInputStyle">
    <input
        type="search"
        placeholder="Поиск по VIN"
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
  </div>
</template>
<script setup>
import {computed, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";

const text = ref('')
const emits = defineEmits(['buttonFilterSelect', 'openFilter', 'updateSearchText', 'getData'])
const props = defineProps(['buttons', 'isOpen'])
const activeCode = props.buttons.find(el => el.active).code
const activeButton = ref(activeCode)


const searchInputStyle = computed(() => {
  return useGlobalStore().isMobileView ? {textAlign: 'center'} : {float: 'right'}
})

function clicked(code) {
  activeButton.value = code
  emits('buttonFilterSelect', code)
}


</script>
<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 600"
            :top="73"
            :title="'Создать событие'"
            :subtitle="subtitle"
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <div>
        <span class="label-red label-right">Результат встречи:</span>
        <el-select
            placeholder="Выберите значение"
            v-model="zzz">
          <el-option v-for="(item, ind) in lists" :key="ind" :label="item" :value="item"/>
        </el-select>
      </div>

      <div>

        <span class="label-red label-right">Ответственный:</span>
        <el-select
            placeholder="Выберите значение"
            v-model="userResponsibleId">
          <el-option v-for="(item, ind) in users" :key="ind" :label="item" :value="item"/>
        </el-select>
      </div>

      <div>
        <span class="label-red label-right">Описание:</span>
        <textarea
            name="description"
            id="description"
            v-model="description"
            type="text"
        ></textarea>
      </div>

      <div>
        <span class="label-red label-right">Дата:</span>
        <textarea
            name="description"
            id="description"
            v-model="description"
            type="text"
        ></textarea>

        <div>
          <label>
            <el-checkbox/>
            Поставить себя ответственным на событие
          </label>
        </div>
      </div>
    </el-scrollbar>
  </AppModal>
</template>

<style>

</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";

const globalStore = useGlobalStore();
const appealStore = useAppealStore()
const isOpen = ref(false);
const appeal = ref({});
const closeModal = () => isOpen.value = false;
const subtitle = ref('')
let cb;


function open(row, cbModal) {
  cb = cbModal
  console.log('row', row)
  isOpen.value = true
}

defineExpose({open});

</script>
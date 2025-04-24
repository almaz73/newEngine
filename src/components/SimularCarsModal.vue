<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 930"
            :top="40"
            :title="'Список подобных автомобилей'"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">

      <el-table
          :data="tableData"
          empty-text="Нет данных"
          highlight-current-row
      >
        <el-table-column label="Модель" prop="brand">
          <template #default="scope">
            {{ scope.row.brand }} {{ scope.row.model }}
          </template>
        </el-table-column>
        <el-table-column label="Год выпуска" prop="year"/>
        <el-table-column label="Максимальная цена выкупа" prop="maxPriceBought"/>
        <el-table-column label="Фактическая цена выкупа" prop="factPriceBought"/>
        <el-table-column label="Категория" prop="auto.categoryAuto">
          <template #default="scope">
            <CircleCateforyAvtoCtrl :categoryName="scope.row.category"/>
          </template>
        </el-table-column>
        <el-table-column label="Город" prop="city"/>
      </el-table>

    </el-scrollbar>
  </AppModal>
</template>
<style>


</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useDealStore} from "@/stores/dealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {ElTable} from "element-plus";
import CircleCateforyAvtoCtrl from "@/controls/CircleCateforyAvtoCtrl.vue";

const globalStore = useGlobalStore();
const dealStore = useDealStore();
const isOpen = ref(false);
const closeModal = () => isOpen.value = false;
const tableData = ref([])


function open() {
  isOpen.value = true;

  let params = {
    carModelId: dealStore.deal.auto.carModelId,
    yearReleased: dealStore.deal.auto.yearReleased,
    driveType: dealStore.deal.auto.driveType,
    gearboxType: [dealStore.deal.auto.gearboxType]
  }

  dealStore.getSimularCars(JSON.stringify(params)).then(res => tableData.value = res.items)

}


defineExpose({open});


</script>
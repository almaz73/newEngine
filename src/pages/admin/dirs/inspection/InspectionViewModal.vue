<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 480"
            :top="40"
            :title="'Элемент осмотра'"
            draggable
            resizable>
    <el-scrollbar maxHeight="480px">

      <span class="modal-fields">
        <span>
          <el-input placeholder="Название *" title="Название" v-model="insp.name"/>

          <el-select
              title="Категория осмотра"
              placeholder="Категория осмотра"
              v-model="insp.inspectionItemCategory"
              filterable
              clearable>
              <el-option v-for="item in inspectionItemCategories" :key="item.id" :label="item.name"
                         :value="item.id"/>
           </el-select>

          <el-select
              title="Провреждения"
              placeholder="Провреждения"
              v-model="insp.inspectionItemTypeDamageIds"
              filterable
              clearable>
              <el-option v-for="item in damages" :key="item.id" :label="item.damageName" :value="item.id"/>
          </el-select>

          <el-select
              title="Интерфейс"
              placeholder="Интерфейс"
              v-model="insp.inspectionUiType"
              filterable
              clearable>
              <el-option v-for="item in inspectionUiType" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <hr>
          <el-input placeholder="Порядок" title="Порядок" v-model="insp.order"/><br>
          <el-checkbox label="Толщина ЛКП" v-model="insp.isPaintworkAvailable"/>
          <el-checkbox label="Блокировка выгрузки в 1С" v-model="insp.exportBlock"/>
        </span>
        <div style="text-align: right">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </div>
      </span>
    </el-scrollbar>
  </AppModal>
</template>
<style>


</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {inspectionItemCategories, inspectionUiType} from "@/utils/globalConstants";
import {checkingOnEmptyInput} from "@/utils/globalFunctions.ts"
const globalStore = useGlobalStore();
const isOpen = ref(false);
const insp = ref({});
const closeModal = () => isOpen.value = false;

const adminStore = useAdminStore();
let cb;
const damages = ref([])


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  if (!row) insp.value = {};
  else adminStore.getInspection(row.id).then(res => insp.value = res);

  adminStore.getDomage().then(res => damages.value = res.items);

}
function save() {
  let emptyCheckArr = [
    {fieldName:"Название",check:insp.value.name},
    {fieldName:"Категория осмотра",check:insp.value.inspectionItemCategory},
    {fieldName:"Интерфейс",check:insp.value.inspectionUiType},
    {fieldName:"Порядок",check:insp.value.order},
  ]
  if(checkingOnEmptyInput(emptyCheckArr)) return false
  
  adminStore.saveInspection(insp.value).then(() => {
    ElMessage({message: "Осмотр успешно сохранен", type: "success"});
    isOpen.value = false;
    cb();
  });
}

defineExpose({open});


</script>
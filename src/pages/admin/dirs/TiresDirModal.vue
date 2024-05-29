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
  <UsersDirModal_History ref="modalHistory"/>
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
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
import {inspectionItemCategories, inspectionUiType} from "@/utils/globalConstants";

const globalStore = useGlobalStore();
const isOpen = ref(false);
const insp = ref({});
const closeModal = () => isOpen.value = false;

const modalHistory = ref(null);
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


function checking() {
  if (!insp.value.name) {
    return ElMessage({message: 'Поле "Название" обязетелен для заполнения', type: "warning"});
  }
  if (!insp.value.inspectionItemCategory) {
    return ElMessage({message: 'Поле "Категория осмотра" обязетелен для заполнения', type: "warning"});
  }
  if (!insp.value.inspectionUiType) {
    return ElMessage({message: 'Поле "Интерфейс" обязетелен для заполнения', type: "warning"});
  }
  if (!insp.value.order) {
    return ElMessage({message: 'Поле "Порядок" обязетелен для заполнения', type: "warning"});
  }
}

function save() {
  if (checking()) return false;
  adminStore.saveInspection(insp.value).then(() => {
    ElMessage({message: "Осмотр успешно сохранен", type: "success"});
    isOpen.value = false;
    cb();
  });
}

defineExpose({open});


</script>
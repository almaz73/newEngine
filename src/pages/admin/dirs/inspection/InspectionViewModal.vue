<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 480"
            :top="40"
            :title="'Элемент осмотра'"
            draggable
            resizable>
    <el-scrollbar maxHeight="480px">

      <div class="modal-fields">
        <el-form ref="form" :model="insp" class="error-to-message">
          <el-form-item prop="name" :rules="{required: true, message: 'Название', trigger: ['change']}">
            <el-input placeholder="Название *" title="Название" v-model="insp.name"/>
          </el-form-item>

          <el-form-item prop="inspectionItemCategory" :rules="{required: true, message: 'Категория осмотра', trigger: ['change']}">
            <el-select
                title="Категория осмотра"
                placeholder="Категория осмотра"
                v-model="insp.inspectionItemCategory"
                filterable
                clearable>
              <el-option v-for="item in inspectionItemCategories" :key="item.id" :label="item.name"
                         :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-select
              style="margin-bottom: 10px"
              title="Провреждения"
              placeholder="Провреждения"
              v-model="insp.inspectionItemTypeDamageIds"
              filterable
              clearable>
              <el-option v-for="item in damages" :key="item.id" :label="item.damageName" :value="item.id"/>
          </el-select>

          <el-form-item prop="inspectionUiType" :rules="{required: true, message: 'Интерфейс', trigger: ['change']}">
            <el-select
                title="Интерфейс"
                placeholder="Интерфейс"
                v-model="insp.inspectionUiType"
                filterable
                clearable>
                <el-option v-for="item in inspectionUiType" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-divider/>

          <el-form-item prop="order" :rules="{required: true, message: 'Порядок', trigger: ['change']}">
            <el-input placeholder="Порядок" title="Порядок" v-model="insp.order"/><br>
          </el-form-item>

          <el-checkbox label="Толщина ЛКП" v-model="insp.isPaintworkAvailable"/>
          <el-checkbox label="Блокировка выгрузки в 1С" v-model="insp.exportBlock"/>
        </el-form>
        <div style="text-align: right">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
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
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {inspectionItemCategories, inspectionUiType} from "@/utils/globalConstants";
import {checkEmptyFields} from "@/utils/globalFunctions.ts"
const globalStore = useGlobalStore();
const isOpen = ref(false);
const insp = ref({});
const closeModal = () => isOpen.value = false;

const adminStore = useAdminStore();
let cb;
const damages = ref([])
const form = ref(null)


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  if (!row) insp.value = {};
  else adminStore.getInspection(row.id).then(res => insp.value = res);

  adminStore.getDomage().then(res => damages.value = res.items);

}
function save() {
  checkEmptyFields(form.value).then(res => { // проверка заполненности обязательных полей
    res && adminStore.saveInspection(insp.value).then(() => {
      ElMessage({message: "Осмотр успешно сохранен", type: "success"});
      isOpen.value = false;
      cb();
    });
  })
}

defineExpose({open});


</script>
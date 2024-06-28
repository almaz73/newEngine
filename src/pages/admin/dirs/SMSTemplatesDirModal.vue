<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="340"
            :top="40"
            :title="'Категория наценки'"
            draggable>
    <el-scrollbar maxHeight="480px">
      <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-field">
          <div class="text-info">
            <label>Теги: </label>
            <label><span>[accost]</span> - форма обращения (Уважаемый -ая)</label>
            <label><span>[clientIO]</span> - ио клиента</label>
            <label><span>[appealId]</span> - номер обращения</label>
            <label><span>[meetDate]</span> - дата встречи</label>
            <label><span>[meetAddress]</span> - адрес встречи</label>
            <label><span>[appealManager]</span> - менеджер обращения (Фамилия Имя)</label>
            <label><span>[appealManagerName]</span> - менеджер обращения (Имя)</label>
        </div>
          <el-form-item prop="title" :rules="{required: true, message: 'Название', trigger: ['change']}">
            <label class="label-right l_100">Название</label>
            <el-input
                style="width: 190px"
                v-model="model.title"
                clearable
                placeholder="Название" />
        </el-form-item>
        <el-form-item prop="text" :rules="{required: true, message: 'Текст', trigger: ['change']}">
            <label class="label-right l_100">Текст</label>
            <el-input
                style="width: 190px"
                v-model="model.text"
                clearable
                placeholder="Текст" />
          </el-form-item>
        <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>

        </span>
        </el-form>
    </el-scrollbar>
  </AppModal>
</template>
<style>
.text-info{
  display: flex;
  flex-direction: column;
  margin-bottom:5px;
}
.text-info label{
  margin-bottom:2px;
}
.text-info span{
  color:#d34439 !important;
}
</style>
<script setup>
import AppModal from "@/components/AppModal.vue";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {checkEmptyFields} from "@/utils/globalFunctions";
const isOpen = ref(false);
const model = ref({});
const form = ref(null)
const closeModal = () => isOpen.value = false;
const adminStore = useAdminStore();
let cb;

function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  model.value = JSON.parse(JSON.stringify(row))
}


function save() {
  checkEmptyFields(form.value).then(res => {
    res && adminStore.saveSMSTemplates(model.value).then(() => {
    ElMessage({message: "Запись успешно сохранена", type: "success"});
    isOpen.value = false;
    cb();
  });
  }) 

}

defineExpose({open});
</script>
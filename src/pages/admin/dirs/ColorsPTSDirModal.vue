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
          <el-form-item prop="colorName" :rules="{required: true, message: 'Цвет', trigger: ['change']}">
          <small>
            <label class="label-right l_100">Цвет</label>
            <el-input
                style="width: 190px"
                v-model="model.colorName"
                clearable
                placeholder="Цвет">
           </el-input>
          </small>
        </el-form-item>
        <el-form-item prop="colorCode" :rules="{required: true, message: 'Цветовой код', trigger: ['change']}">
          <small>
            <label class="label-right l_100">Цветовой код</label>
            <el-color-picker v-model="model.colorCode"/>
        <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </small>
      </el-form-item>
        </span>
        </el-form>
    </el-scrollbar>
  </AppModal>
</template>

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
    res && adminStore.addColor(model.value, 20).then(() => {
    ElMessage({message: "Запись успешно сохранена", type: "success"});
    isOpen.value = false;
    cb();
  });
  }) 

}

defineExpose({open});
</script>
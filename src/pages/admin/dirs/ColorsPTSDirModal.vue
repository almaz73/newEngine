<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="340"
            :top="40"
            :title="'Категория наценки'"
            draggable>
    <el-scrollbar maxHeight="480px">
        <span class="modal-field">
          <small>
            <label class="label-right l_100">Цвет</label>
            <el-input
                style="width: 190px"
                v-model="model.colorName"
                  clearable
                  placeholder="Цвет">
           </el-input>
          </small>
          <small>
            <label class="label-right l_100">Цветовой код</label>
            <el-color-picker v-model="model.colorCode"/>
        <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </small>
        </span>
    </el-scrollbar>
  </AppModal>
</template>
<style>
.input-width {
  width: 100px;
  overflow-x: hidden;
}

</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const organizations = ref([])
const departments = ref([])
const globalStore = useGlobalStore();
const isOpen = ref(false);
const model = ref({});
const closeModal = () => isOpen.value = false;
const adminStore = useAdminStore();
let cb;

function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  model.value = JSON.parse(JSON.stringify(row))


}


function checking() {
  if (!model.value.colorName) {
    return ElMessage({message: 'Поле "Цвет" обязетелен для заполнения', type: "warning"});
  }
  if (!model.value.colorCode) {
    return ElMessage({message: 'Поле "Цветовой код" обязетелен для заполнения', type: "warning"});
  }
}

function save() {
  if (checking()) return false;
  adminStore.addColor(model.value,20).then(() => {
    ElMessage({message: "Запись успешно сохранена", type: "success"});
    isOpen.value = false;
    cb();
  });
}

defineExpose({open});


</script>
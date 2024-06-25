<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="'Машина'"
            draggable>
    <div>
      <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-field">
          <el-form-item prop="brand" :rules="{required: true, message: 'Марка', trigger: ['change']}">
            <label class="label-right l_100">Марка</label>
            <el-input
                style="width: 190px"
                v-model="model.brand"
                  clearable
                  placeholder="Марка">
           </el-input>
          </el-form-item>
          <el-form-item prop="model" :rules="{required: true, message: 'Модель', trigger: ['change']}">
            <label class="label-right l_100">Модель</label>
            <el-input
                style="width: 190px"
                v-model="model.model"
                  clearable
                  placeholder="Модель">
           </el-input>
          </el-form-item>
          <el-form-item prop="model" :rules="{required: true, message: 'Модель', trigger: ['change']}">
           <label class="label-right l_100">Тип</label>
           <el-select
            v-model="model.type"
            style="width: 190px"
          >
            <el-option
              v-for="item in autoTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select> 
        </el-form-item> 
          <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </span>
      </el-form>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {autoTypeList} from "@/utils/globalConstants"
import {checkEmptyFields} from "@/utils/globalFunctions";
const isFilialsModal = ref(false)
const form = ref(null)
const globalStore = useGlobalStore();
const isOpen = ref(false);
const model = ref({});
const closeModal = () => isOpen.value = false;
const adminStore = useAdminStore();
let cb;

function open(row, cbModal,_isFilialsModal) {
  cb = cbModal;
  isOpen.value = true;
  isFilialsModal.value = _isFilialsModal

  if (!row) model.value = { brand:'',model:'',type:''};
  else model.value = JSON.parse(JSON.stringify(row))
}

function save() {
  checkEmptyFields(form.value).then(res => { 
    model.value.entityType = 20
    res && adminStore.saveBrands(model.value).then(() => {
      ElMessage({message: "Бренд успешно сохранен", type: "success"});
      isOpen.value = false;
      cb();
    });
  })

}


defineExpose({open});


</script>
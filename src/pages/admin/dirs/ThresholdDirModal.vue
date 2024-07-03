<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="'Пороговые значения'"
            draggable>
    <el-scrollbar maxHeight="480px">
      <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-field">
          <el-form-item prop="orgId" :rules="{required: true, message: 'Организация', trigger: ['change']}">
            <small>
              <label class="label-right l_100">Организация</label>
              <el-select
                style="width: 190px"
                placeholder="Организация"
                v-model="model.orgId"
                filterable
                clearable>
                  <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
            </small>
          </el-form-item>
          <el-form-item prop="maxPrice" :rules="{required: true, message: 'Максимальный порог, руб.', trigger: ['change']}">
              <label class="label-right l_100">Максимальный порог, руб.</label>
              <el-input
                  v-model="model.maxPrice"
                  clearable
                  placeholder="Максимальный порог, руб.">
            </el-input>
          </el-form-item>
          <el-form-item prop="maxPercentage" :rules="{required: true, message: 'Максимальный порог, процент.', trigger: ['change']}">
              <label class="label-right l_100">Максимальный порог, процент.</label>
              <el-input
                  min="0"
                  max="100"
                  @input="checkPercentage('maxPercentage')"
                  v-model="model.maxPercentage"
                  placeholder="Максимальный порог, процент.">
            </el-input>
          </el-form-item>
          <el-form-item prop="validFrom" :rules="{required: true, message: 'Период действия, c', trigger: ['change']}">
              <label class="label-right l_100">Период действия, c</label>
              <el-date-picker
                style="width: 190px; overflow-x: hidden;"
                v-model="model.validFrom"
                format="DD.MM.YYYY"
            />
          </el-form-item>
          <el-form-item prop="validTo" :rules="{required: true, message: 'Период действия, до', trigger: ['change']}">
              <label class="label-right l_100">Период действия, до</label>
              <el-date-picker
              style="width: 190px; overflow-x: hidden;"
              v-model="model.validTo"
              format="DD.MM.YYYY"
          />
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

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {checkEmptyFields} from "@/utils/globalFunctions";
const globalStore = useGlobalStore()
const organizations = ref([])
const isOpen = ref(false);
const model = ref({});
const form = ref(null)
const closeModal = () => isOpen.value = false;
const adminStore = useAdminStore();
let cb;


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  if(!row){
      model.value = {
      maxPercentage: null,
      maxPrice: null,
      orgName: '',
      orgId: null,
      validFrom: null,
      validTo: null
      }
  }
  else model.value = JSON.parse(JSON.stringify(row))
  globalStore.getOrganizations().then(res => organizations.value = res.items)
}
function save() {

  checkEmptyFields(form.value).then(res => {
    if(res){
      let row = model.value
      row.validFrom = new Date(row.validFrom)
      row.validTo = new Date(row.validTo)
      adminStore.saveMaxPrice(row).then(res => {
        if (res !== undefined) {
        ElMessage({message: 'Новое пороговое значение сохранено.', type: 'success'})
        isOpen.value = false;
        cb()
        }
      })
    }
  }) 

}
function checkPercentage(category) {
if (model.value[category] > 100) model.value[category] = 100;
if (model.value[category] < 0) model.value[category] = 0;
}

defineExpose({open});
</script>
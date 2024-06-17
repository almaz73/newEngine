<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="340"
            :top="40"
            :title="'Категория наценки'"
            draggable>
    <el-scrollbar maxHeight="480px">

      <span class="modal-fields">

          <small>
            <label class="label-right l_100">Организация</label>
            <el-select
                style="width: 190px"
                placeholder="Организация"
                @change="changeOrg"
                v-model="model.orgElement.id"
                filterable
                clearable>
              <el-option v-for="item in organizations" :key="item.id" :label="item.name"
                         :value="item.id"/>
           </el-select>
          </small>

          <small>
            <label class="label-right l_100">Отдел</label>
            <el-select
                style="width: 190px"
                title="Организация"
                placeholder="Организация"
                v-model="model.department.id"
                filterable
                clearable>
              <el-option v-for="item in departments" :key="item.id" :label="item.name"
                         :value="item.id"/>
           </el-select>
          </small>

          <small>
             <label class="label-right l_100">A, %</label>
             <el-input type="number" v-model="model.categoryA" class="input-width"/>
          </small>
           <small>
               <label class="label-right l_100">B, %</label>
               <el-input type="number" v-model="model.categoryB" class="input-width"/>
          </small>
           <small>
               <label class="label-right l_100">C, %</label>
               <el-input type="number" v-model="model.categoryC" class="input-width"/>
          </small>
           <small>
               <label class="label-right l_100">D, %</label>
               <el-input type="number" v-model="model.categoryD" class="input-width"/>
          </small>
           <small>
               <label class="label-right l_100">S, %</label>
               <el-input type="number" v-model="model.categoryS" class="input-width"/>
          </small>

          <small>
             <label class="label-right l_100">Период действия,  с</label>
             <el-date-picker
                 style="width: 160px; overflow-x: hidden;"
                 editable
                 format="DD.MM.YYYY"
                 v-model="model.validFrom"/>
        </small>

        <small>
             <label class="label-right l_100">Период действия,  до</label>
             <el-date-picker
                 style="width: 160px; overflow-x: hidden;"
                 editable
                 format="DD.MM.YYYY"
                 v-model="model.validTo"/>
        </small>

        <div style="text-align: right; margin-top: 12px">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </div>
      </span>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
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
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";

const organizations = ref([])
const departments = ref([])
const globalStore = useGlobalStore();
const isOpen = ref(false);
const model = ref({});
const closeModal = () => isOpen.value = false;

const modalHistory = ref(null);
const adminStore = useAdminStore();
let cb;


function changeOrg(id) {
  adminStore.getDepartmentsWithBuyLocations(id).then(res => departments.value = res)
}

function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  if (!row) model.value = {orgElement:{id:null}, department:{id:null}};
  else model.value = JSON.parse(JSON.stringify(row))

  globalStore.getOrganizations().then(res => organizations.value = res.items)
  if (model.value.orgElement.id) changeOrg(model.value.orgElement.id)
}


function checking() {
  if (!model.value.orgElement) {
    return ElMessage({message: 'Поле "организация" обязетелен для заполнения', type: "warning"});
  }
  if (!model.value.validFrom) {
    return ElMessage({message: 'Поле "Период действаия, с" обязетелен для заполнения', type: "warning"});
  }
  if (!model.value.validTo) {
    return ElMessage({message: 'Поле "Период действаия, до" обязетелен для заполнения', type: "warning"});
  }
}

function save() {
  if (checking()) return false;
  adminStore.saveMarkupCategory(model.value).then(() => {
    ElMessage({message: "Категория наценки успешно сохранена", type: "success"});
    isOpen.value = false;
    cb();
  });
}

defineExpose({open});


</script>
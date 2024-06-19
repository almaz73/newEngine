<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 500"
            :top="40"
            :title="'Обращения'"
            draggable>
    <el-scrollbar>

      <span class="modal-fields">
        <el-button-group style="vertical-align: center">
          <template v-for="flow in Workflows" :key="flow.value">
          <el-button v-if="flow.value<11"
                     @click.stop="activeName=flow.title"
                     :type="flow.title!==activeName?'success':''">
            {{ flow.title }}
          </el-button>
            </template>
        </el-button-group>
        <br><br>
          <small>
             <label class="label-right l_100">Источник</label>
            <el-select
                style="width: 110px; margin-right: 12px"
                v-model="model.flow"
                filterable>
              <el-option v-for="item in treatmentSources" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </small>
           <small>
             <label class="label-right l_100">Ответственный</label>
               <el-select
                   style="width: 110px; margin-right: 12px"
                   v-model="model.flow"
                   filterable>
              <el-option v-for="item in managers" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
          </small>
<el-divider/>
        Автомобиль<br>
         <small>
               <label class="label-right l_100">Обьявления</label>
               <el-input v-model="model.categoryC"/>
          </small><br>
            <small>
             <label class="label-right l_100">Марка</label>
             <el-select style="width: 120px;"></el-select>
          </small>
          <small>
             <label class="label-right l_100">Модель</label>
             <el-select style="width: 120px;"></el-select>
          </small><br>
          <small>
               <label class="label-right l_100">Год выпуска</label>
             <el-select style="width: 120px;"></el-select>
          </small>

        <el-divider/>

         Клиент<br>
        <small>
             <label class="label-right l_100">Тип клиента</label>
             <el-select style="width: 120px;"></el-select>
          </small>
        <br>
          <small>
             <label class="label-right l_100">Фамилия</label>
             <el-input ></el-input>
          </small><br>
          <small>
             <label class="label-right l_100">Имя</label>
             <el-input ></el-input>
          </small><br>
        <small>
             <label class="label-right l_100">Отчество</label>
             <el-input ></el-input>
          </small><br>

        <small>
             <label class="label-right l_100">Контактный телефон</label>
             <el-input style="width: 100px; overflow: hidden "></el-input>
          </small>

         <small>
             <label class="label-right l_100">Контактная эл.почта</label>
             <el-input  style="width: 100px; overflow: hidden "></el-input>
          </small><br>



        <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
      </span>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
</template>


<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {Workflows} from "@/utils/globalConstants";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";

const activeName = ref('Продажа')
const organizations = ref([])
const globalStore = useGlobalStore();
const isOpen = ref(false);
const model = ref({});
const treatmentSources = ref([])
const managers = ref([])
const closeModal = () => isOpen.value = false;

const modalHistory = ref(null);
const adminStore = useAdminStore();
let cb;



function open(row, cbModal) {
  console.log('row, cbModal', row, cbModal)

  cb = cbModal;
  isOpen.value = true;

  globalStore.getTreatmentSources().then(res => {
    treatmentSources.value = res.items
  })
  globalStore.getUsers().then(res => {
    managers.value = res.items
  })
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
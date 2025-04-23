<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 930"
            :top="40"
            :title="title"
            :subtitle="org.name"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">

      <div class="modal-fields">
        <el-form ref="form" :model="org" @change="isDirty=true">
          <el-tabs v-model="activeName" @tab-change="tabChange">
              <el-tab-pane label="Организация" name="first">
                <el-input placeholder="Название *" title="Название" v-model="org.name" clearable/>
                <el-select
                    title="Тип"
                    placeholder="Тип"
                    v-model="org.type"
                    style="width: 200px; margin:0 20px 0 10px"
                    filterable
                    clearable>
                    <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"/>
                 </el-select>

                 <el-select
                     v-if="org.type === 10"
                     title="Статус партнерства"
                     placeholder="Статус партнерства"
                     v-model="org.partnerStatus"
                     style="width: 200px; margin:0 20px 0 10px"
                     clearable>
                    <el-option v-for="item in statuses" :key="item.id" :label="item.name" :value="item.id"/>
                 </el-select>

                 <el-input placeholder="Город" title="Город" v-model="org.city"/>

                <br><br>
                <span v-if="org.type === 10">Настройки подключения к 1С
                   &nbsp; &nbsp; <el-button @click="addServer1C()"
                              :icon="Plus">Добавить</el-button>
                </span>
                <div v-for="(serv, ind) in org.server1C" :key="ind">
                  <small>
                    <label class="label l_300">Адрес сервера 1С:*</label>
                    <el-input type="text" v-model="serv.address1CServer"
                    ></el-input>
                  </small><br>
                  <small>
                    <label class="label l_300">Порт сервера 1С:*</label>
                    <el-input type="text" v-model="serv.port1CServer"
                    ></el-input>
                  </small><br>
                  <small>
                    <label class="label l_300">Имя базы данных сервера 1С*</label>
                    <el-input type="text" v-model="serv.bdName"
                    ></el-input>
                  </small><br>

                  <div>
                    <el-checkbox v-model="serv.usingAvtosetService">Использовать AvtosetService</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox v-model="serv.isRequired">Обязательная выгрузка в 1С</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox v-model="serv.isStopped">Выгрузка приостановлена</el-checkbox>
                  </div>
                </div>


                <hr>
              </el-tab-pane>
              <el-tab-pane label="Права">
                <el-select
                    title="Права"
                    placeholder="Права"
                    v-model="org.policyIds"
                    style="width: 500px; margin:0 20px 0 10px"
                    filterable
                    multiple
                    clearable>
                  <el-option v-for="item in policyList" :key="item.id" :label="item.title" :value="item.id"/>
                </el-select>
              </el-tab-pane>
            <el-tab-pane label="Настройки">
              <el-checkbox v-model="org.isVinCheckDisabled">Приостановка валидации на наличие автомобиля на складе</el-checkbox><br>
              <el-checkbox v-model="org.isQrAvailable">Формирование QR кода в ценниках</el-checkbox><br>
              <el-checkbox v-model="org.isQrAvailable">Использовать новую методику оценки</el-checkbox><br>
              <el-checkbox v-model="org.useMaxPrice">Использовать пороговое значение</el-checkbox>
            </el-tab-pane>
          </el-tabs>


        </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
        <el-button type="info" @click="isOpen = false">Отмена</el-button>
      </div>
      </div>
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

const activeName = ref('first')
const globalStore = useGlobalStore();
const isOpen = ref(false);
const org = ref({name: '', partnerStatus: null, type: null});
const closeModal = () => isOpen.value = false;
const policies = ref([])
const title = ref("");
const modalHistory = ref(null);
const adminStore = useAdminStore();
const organizations = ref([]);
const isDirty = ref(false);
let cb;
const types = [{id: 10, name: 'Организация'}, {id: 20, name: 'Отдел'}]
const statuses = [{id: 10, name: 'Подготовка'}, {id: 20, name: 'Активно'},
  {id: 30, name: 'Приостановлено'}, {id: 40, name: 'Прекращено'}]
const policyList = ref([])

function tabChange(val) {
  if (val === '1') {
    adminStore.getPolicy().then(res => {
      policyList.value = res.items
    })
  }
}

function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  title.value = "Организация";
  adminStore.getOrganization(row.id).then(res => {
    org.value = res.view
  })

}


function checking() {
  if (!org.value.login || !org.value.password) {
    return ElMessage({message: "44444", type: "warning"});
  }

}

function save() {
  if (checking()) return false;

  console.log('org', org)

  // adminStore.saveUser(org.value).then(() => {
  //   ElMessage({message: "Успешно", type: "success"});
  //   isOpen.value = false;
  //   cb();
  // });
}

defineExpose({open});


</script>
<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 930"
            :top="40"
            :title="title"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">

      <span class="modal-fields">
        <el-form ref="form" :model="org" @change="isDirty=true">
          <el-tabs v-model="activeName">
              <el-tab-pane label="Организация" name="first">
<!--:::::::::::::-->
                <el-input placeholder="Название *" title="Название" v-model="org.parentName"/>
                <el-input placeholder="Тип" title="Тип" v-model="org.type"/>
                 <el-select
                     title="Статус партнерства"
                     placeholder="Статус партнерства"
                     v-model="org.isActive"
                     filterable
                     clearable>
                    <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id"/>
                 </el-select>
                 <el-input placeholder="Город" title="Город" v-model="org.city"/>
                <hr>
              </el-tab-pane>
              <el-tab-pane label="Права">
<!--:::::::::::::-->
                <el-select
                    title="Статус партнерства"
                    placeholder="Статус партнерства"
                    v-model="org.isActive"
                    filterable
                    multiple
                    clearable>
                    <el-option v-for="item in policies" :key="item.id" :label="item.title" :value="item.id"/>
                 </el-select>
              </el-tab-pane>
            <el-tab-pane label="Настройки">

<!--:::::::::::::-->
              333
              </el-tab-pane>
          </el-tabs>


        </el-form>
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
import {computed, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";

const activeName = ref('first')
const globalStore = useGlobalStore();
const isOpen = ref(false);
const userInit = {
  login: "",
  person: {firstName: "", middleName: "", lastName: ""},
  avatar: {url: ""},
  organization: {},
  department: {},
  location: {},
  role: {}
};
const org = ref(userInit);
const closeModal = () => isOpen.value = false;

const policies=ref([])
const title = ref("");
const modalHistory = ref(null);
const adminStore = useAdminStore();
const organizations = ref([]);
const isDirty = ref(false);
let cb;
const subtitle = computed(() => {
  let fio = "";
  return fio || "Новый  пользователь";
});


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  title.value = "🚧Организация";
  if (!row) org.value = userInit;
  else adminStore.getOrganization(row.id).then(res => {
    console.log("res.view", res.view);
    // org.value = res.view;
  });

  adminStore.getPolicy().then(res=>{
    console.log('res', res)
    policies.value = res.items
  })
}


function checking() {
  if (!org.value.login || !org.value.password) {
    return ElMessage({message: "44444", type: "warning"});
  }

}

function save() {
  if (checking()) return false;
  adminStore.saveUser(org.value).then(() => {
    ElMessage({message: "Успешно", type: "success"});
    isOpen.value = false;
    cb();
  });
}

defineExpose({open});


</script>
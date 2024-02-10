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
          <el-tabs v-model="activeName"
                   class="demo-tabs">

              <el-tab-pane label="Организация" name="first">

                <el-input placeholder="Название *" title="Название" v-model="org.parentName" />
                <el-input placeholder="Тип" title="Тип" v-model="org.type" />
                 <el-select
                   title="Статус партнерства"
                   placeholder="Статус партнерства"
                   v-model="org.isActive"
                   filterable
                   clearable>
                    <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id" />
                 </el-select>
                 <el-input placeholder="Город" title="Город" v-model="org.city" />
                <hr>
                <el-input placeholder="Отчество" title="Отчество" v-model="org.middleName" />
                <el-input placeholder="Email" title="Email" v-model="org.email" />
                <el-input placeholder="Телефон" title="Телефон" v-model="org.phone" />
                <el-input placeholder="Доп.телефон" title="Доп.телефон" v-model="org.phone2" />
                <hr>


                <el-select
                  title="Отдел"
                  placeholder="Отдел *"
                  v-model="org.id"
                  filterable
                  clearable>
                    <el-option v-for="item in departmentsChosen" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>

                <el-select
                  title="Место хранения/выкупа"
                  placeholder="Место хранения/выкупа *"
                  v-model="org.id"
                  filterable
                  clearable>
                    <el-option v-for="item in locationsChosen" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>

                <el-select
                  title="Часовой пояс"
                  placeholder="Часовой пояс"
                  v-model="org.timeZone"
                  filterable
                  clearable>
                    <el-option v-for="item in timeZones" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>

                <el-input placeholder="Должность *" :title="'Должность: '+org.position" v-model="org.position" />
                <hr>


              </el-tab-pane>
              <el-tab-pane label="Права">
                222
              </el-tab-pane>
            <el-tab-pane label="Настройки">
              333
              </el-tab-pane>
          </el-tabs>


        </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
        <el-button type="info" @click="isOpen = false">Отменить</el-button>
      </div>
      </span>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory" />
</template>
<style>

.modal-fields .el-input {
  margin: 2px 12px;
}

.modal-fields hr {
  border: 1px solid #ddd;
}

.dark .modal-fields hr {
  border: 1px solid #444;
}

.photo-place {
  max-width: 120px;
  object-fit: cover;
  max-height: 120px;
  height: 120px;
  margin-bottom: -10px;
  margin-left: 20px;
  border-radius: 8px;
}

</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { useAdminStore } from "@/stores/adminStore";
import { computed, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
import { decryptPassword } from "@/utils/globalFunctions";
import TabDone from "@/views_Developer/TabDone.vue";

const activeName = ref('first')
const globalStore = useGlobalStore();
const isOpen = ref(false);
const userInit = {
  login: "",
  person: { firstName: "", middleName: "", lastName: "" },
  avatar: { url: "" },
  organization: {},
  department: {},
  location: {},
  role: {}
};
const org = ref(userInit);
const closeModal = () => isOpen.value = false;

const title = ref("");
const modalHistory = ref(null);
const adminStore = useAdminStore();
const organizations = ref([]);
const departments = ref([]);
const departmentsChosen = computed(() => departments.value.filter(el => el.id === org.value.id));
const locations = ref([]);
const locationsChosen = computed(() => locations.value.filter(el => el.id === org.value.id));
const timeZones = ref([]);
const form = ref(null);
const isDirty = ref(false);
let cb;
const subtitle = computed(() => {
  let fio = "";
  return fio || "Новый  пользователь";
});




function findGruop() {
  // let elem = userGroupRolesMemory.value.find(el => el.roles.find(item => item.value === org.value.role.value))
  // org.value.roleCategory = elem && elem.group.value;
  // roleChanged()
}

function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  title.value = "Организация";
  if (!row) org.value = userInit;
  else adminStore.getOrganization(row.id).then(res => {
    console.log("res.view", res.view);
    org.value = res.view;
    findGruop();
  });
}


function checking() {
  if (!org.value.login || !org.value.password) {
    return ElMessage({ message: "Поля \"Логин\"/\"Пароль\" обязательны для заполнения", type: "warning" });
  }

}

function save() {
  if (checking()) return false;
  adminStore.saveUser(org.value).then(() => {
    ElMessage({ message: "Успешно", type: "success" });
    isOpen.value = false;
    cb();
  });
}

defineExpose({ open });


</script>
<template>
  <main>
    <div class="admin">
      <el-button-group class="left-admin group-button custom gray-buttons">
        <el-select placeholder="Другие справочники" @change="found" style="width: 210px" clearable filterable>
          <el-option v-for="(item, ind) in availableDirectories" :key="ind" :label="item" :value="item" />
        </el-select>

        <el-button v-for="el in adminDirectories" :key="el" @click="found(el)"
          :style="{ width: globalStore.isMobileView ? '243px' : '212px' }"
          :class="{ active: el === currentDirectory, 'btn-with-delete': true }">
          {{ el }}
          <span class="delete-ctrl" @click.stop="remove(el)">
            <DeleteCtrl />
          </span>
        </el-button>
      </el-button-group>

      <div class="admin__Filed">
        <component :is="tab"></component>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { markRaw, ref, computed } from "vue";
import { useGlobalStore } from "@/stores/globalStore";
import ClientsDir from "@/pages/admin/dirs/ClientsDir.vue";
import ThresholdDir from "@/pages/admin/dirs/ThresholdDir.vue";
import EstimateTabs from "@/pages/admin/dirs/estimate/EstimateTabs.vue";
import UsersDir from "@/pages/admin/dirs/UsersDir.vue";
import BrendsDir from "@/pages/admin/dirs/BrendsDir.vue";
import ColorsDir from "@/pages/admin/dirs/ColorsDir.vue";
import OrgsDir from "@/pages/admin/dirs/OrgsDir.vue";
import InspectionTabs from "@/pages/admin/dirs/inspection/InspectionTabs.vue";
import WorksDir from "@/pages/admin/dirs/WorksDir.vue";
import PossibleDamages from "@/pages/admin/dirs/PossibleDamages.vue";
import TiresDir from "@/pages/admin/dirs/TiresDir.vue";
import BanksDir from "@/pages/admin/dirs/BanksDir.vue";
import ColorsPTSDir from "@/pages/admin/dirs/ColorsPTSDir.vue";
import BrendsPTSDir from "@/pages/admin/dirs/BrendsPTSDir.vue";
import StorageDir from "@/pages/admin/dirs/StorageDir.vue";
import CreditProgramDir from "@/pages/admin/dirs/CreditProgramDir.vue";
import SourceDir from "@/pages/admin/dirs/SourceDir.vue";
import SMSTemplatesDir from "@/pages/admin/dirs/SMSTemplatesDir.vue";
import ReasonTemplatesDir from "@/pages/admin/dirs/ReasonTemplatesDir.vue";
import CertificationDir from "@/pages/admin/dirs/CertificationDir.vue";
import PolicyDir from "@/pages/admin/dirs/PolicyDir.vue";
import SignDocumentDir from "@/pages/admin/dirs/SignDocumentDir.vue";
import DeleteCtrl from "@/controls/DeleteCtrl.vue";

const globalStore = useGlobalStore();
const tab = ref(null);

const AdminDirectories = <any>{
  "Пользователи": UsersDir,
  "Орг. структура": OrgsDir,
  "Марки": BrendsDir,
  "Марки по ПТС": BrendsPTSDir,
  "Цвета кузова": ColorsDir,
  "Цвета кузова по ПТС": ColorsPTSDir,
  "Лист осмотра": InspectionTabs,
  "Виды работ": WorksDir,
  "Место хранения": StorageDir,
  "Шины": TiresDir,
  "Банки": BanksDir,
  "Кредитные программы": CreditProgramDir,
  "Источник": SourceDir,
  "СМС шаблоны": SMSTemplatesDir,
  "Политики": PolicyDir,
  "Шаблоны причин": ReasonTemplatesDir,
  "Подпись документов": SignDocumentDir,
  "Клиенты": ClientsDir,
  "Программы сертификации": CertificationDir,
  "Возможные неисправности": PossibleDamages,
  "Пороговое значение": ThresholdDir,
  "Оценки": EstimateTabs,
};

const availableDirectories = computed(() =>
  directories.filter((d) => !adminDirectories.value.includes(d))
);

const directories = Object.keys(AdminDirectories);

let adminDirectories = ref(
  JSON.parse(String(localStorage.getItem("AdminDirectories"))) || []
);
if (!adminDirectories.value.length) {
  adminDirectories.value.push(...["Пользователи", "Орг. структура", "Клиенты"]);
}
const currentDirectory = ref(adminDirectories.value[0]);
selectDir(currentDirectory.value);

function found(val: string) {
  let count = !globalStore.isMobileView ? 7 : 3;
  adminDirectories.value = adminDirectories.value.filter((el: any) => el !== val);
  adminDirectories.value.unshift(val);
  if (adminDirectories.value.length > count) adminDirectories.value.length = count;
  localStorage.setItem("AdminDirectories", JSON.stringify(adminDirectories.value));
  selectDir(val);
}

function selectDir(val: string) {
  currentDirectory.value = val;
  if (AdminDirectories[val]) tab.value = markRaw(AdminDirectories[val]);
}

function remove(val: string) {
  const index = adminDirectories.value.indexOf(val);
  if (index !== -1) {
    adminDirectories.value.splice(index, 1);
    if (val === currentDirectory.value) {
      const fallback = adminDirectories.value[0] || null;
      currentDirectory.value = fallback;
      selectDir(fallback);
    }
    localStorage.setItem("AdminDirectories", JSON.stringify(adminDirectories.value));
  }
  if (!adminDirectories.value.length) {
    adminDirectories.value.push(...["Пользователи", "Орг. структура", "Клиенты"]);
    selectDir(adminDirectories.value[0]);
  }

}
</script>

<style scoped>
.admin {
  padding: 16px;
}

.btn-with-delete {
  position: relative;
  overflow: visible;
}

.delete-ctrl {
  position: absolute;
  right: 10px;
  z-index: 10;
  padding: 6px 2px 2px 2px;
  cursor: pointer;
}
</style>

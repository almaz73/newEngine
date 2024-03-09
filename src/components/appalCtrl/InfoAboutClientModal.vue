<template>
  <AppModal v-if="isOpen && appeal"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 600"
            :top="73"
            :subtitle="appeal.person.lastName + ' '+appeal.person.firstName
            + ' ' +appeal.person.middleName + ' ( '+appeal.person.phone+' ) ' "
            :title="'Подробно о клиенте'"
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'" v-if="appeal">

      <el-tabs v-model="activeName">
        <el-tab-pane label="Общие" name="first">
          <div><span class="label l_200">Фамилия:</span> {{ appeal.person.lastName }}</div>
          <div><span class="label l_200">Имя:</span> {{ appeal.person.firstName }}</div>
          <div><span class="label l_200">Отчество:</span> {{ appeal.person.middleName }}</div>
          <div><span class="label l_200">Источник:</span>
            {{ appeal.treatmentSource.parentName }} {{ appeal.treatmentSource.name }}
          </div>

          <p>Контакты</p>
          <div><span class="label l_200">Телефон:</span> {{ appeal.person.phone }}</div>
          <div><span class="label l_200">
        Адрес регистрации:</span> {{ appeal.person.registrationAddress.fiasAddress && appeal.person.registrationAddress.fiasAddress.value }}
          </div>
          <div><span class="label l_200">Фактический адрес:</span> {{ appeal.person.homeAddress.fiasAddress && appeal.person.homeAddress.fiasAddress.value }}
          </div>

          <p>Паспортные данные</p>

          <div><span class="label l_200">Серия:</span> {{ appeal.person.passportSeries }}</div>
          <div><span class="label l_200">Номер:</span> {{ appeal.person.passportNumber }}</div>
          <div><span class="label l_200">Кем выдан:</span> {{ appeal.person.passportIssueBy }}</div>
          <div><span class="label l_200">Когда:</span> {{ formatDateDDMMYYYY(appeal.person.passportIssueDate) }}</div>

        </el-tab-pane>
        <el-tab-pane label="События">
        </el-tab-pane>
        <el-tab-pane label="Оценки">
        </el-tab-pane>
        <el-tab-pane label="Обращения">
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
    <div style="text-align: right">
      <el-button type="info" @click="clear()">Отменить</el-button>
    </div>
  </AppModal>
</template>

<script setup>

import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAppealStore} from "@/stores/appealStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const isOpen = ref(false)
const appeal = ref(null)
const activeName = ref('first')

function clear() {
  isOpen.value = false
}

function open(row) {
  isOpen.value = true
  appealStore.getLead(row.leadId).then(res => appeal.value = res)
}

defineExpose({open});

</script>
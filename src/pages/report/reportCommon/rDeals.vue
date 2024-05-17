<template>
  <main>
    <div class="filter-report">
      <h2>Информация по сделкам 🐔</h2>

      <div>
        <label class="label l_300">Период</label>

        <el-date-picker
            v-model="searchFilter.startDate"
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
        />
        &nbsp; &nbsp;
        <el-date-picker
            v-model="searchFilter.endDate"
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
        />
        &nbsp; &nbsp;
        <el-select
            style="width: 220px"
            @change="monthChanged()"
            v-model="period"
            filterable>
          <el-option v-for="item in periodItem" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Организация</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.organization"
            multiple
            filterable>
          <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Тип сделки</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.dealType"
            multiple
            filterable>
          <el-option v-for="item in dealTypes" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>

      <br>
      <el-button :icon="Grid" type="danger" @click="getData()" :disabled="isDisable">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <br><br>
    </div>

    <el-table
        size="small"
        v-if="tableData[0]"
        :data="tableData">
      <el-table-column label="Организация" prop="orgParentName"/>
      <el-table-column label="Отдел" prop="organizationName"/>
      <el-table-column label="Тип сделки" prop="dealType"/>
      <el-table-column label="Номер обращения" prop="appealNumber"/>
      <el-table-column label="Дата">
        <template #default="scope">
          {{ formatDateDDMMYYYY(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column label="Коммуникация" prop="communicationType"/>
      <el-table-column label="Источник" prop="source"/>
      <el-table-column label="ФИО клиента" prop="clientName"/>
      <el-table-column label="Телефон">
        <template #default="scope">
          {{ formattingPhone(scope.row.clientPhone) }}
        </template>
      </el-table-column>
      <el-table-column label="Менеджер" prop="managerName"/>
      <el-table-column label="Статус" prop="managerName"/>
      <el-table-column label="Комментарии по статусу" prop="commentStatus"/>
      <el-table-column label="Комментарии по событию" prop="commentEvent"/>
      <el-table-column label="Дата реализации">
        <template #default="scope">
          {{ formatDateDDMMYYYY(scope.row.realizationDate) }}
        </template>
      </el-table-column>
    </el-table>


  </main>
</template>


<script setup>
import {Grid} from "@element-plus/icons-vue";
import {computed, ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {ElMessage} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {formatDateDDMMYYYY, formattingPhone} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const searchFilter = ref({startDate: new Date()})
const reportStore = useReportStore()
const tableData = ref([])
const organizations = ref([])
const dealTypes = ref([])
const period = ref(10)
const periodItem = [
  {title: 'Текущий месяц', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]

const isDisable = computed(() => !searchFilter.value.organization.length || !searchFilter.value.dealType.length)

globalStore.getOrganizations().then(res => organizations.value = res.items)
reportStore.getwWorkflowLeadTypes().then(res => dealTypes.value = res.items)

function init() {
  searchFilter.value.startDate = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.endDate = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.organization = []
  searchFilter.value.dealType = []
}

init()

function monthChanged() {
  let currentMonth = new Date(new Date().setDate(1))
  if (period.value === 20) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
  if (period.value === 30) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 2))

  searchFilter.value.startDate = formatDateDDMMYYYY(currentMonth)
  searchFilter.value.endDate = formatDateDDMMYYYY(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))
}

function getData() {
  tableData.value = []

  const params = {
    startDate: searchFilter.value.startDate,
    endDate: searchFilter.value.endDate,
    orgIds: searchFilter.value.organization,
    workflowLeadTypes: searchFilter.value.dealType
  }

  reportStore.getDealsReport(params).then(res => {
    if (!res.length) return ElMessage.warning('Нет данных')
    tableData.value = res
  })
}

</script>

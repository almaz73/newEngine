<template>
  <div class="vitrina-block little">
    <br>
    <div v-if="globalStore.account.role!=='CallManager'">
      <label class="label-red">Организация</label><br>
      <el-select
        v-model="filter.OrganizationIds"
        multiple
        clearable
        @change="emits('toDirty'); getDepartments()"
      >
        <el-option
          v-for="item in organizations"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <br><br>

      <label class="label-red">Отдел</label><br>
      <el-select
        v-model="filter.DepartmentIds"
        multiple
        @change="emits('toDirty');getManagers()"
        clearable
      >
        <el-option
          v-for="item in departments"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <br><br>


    </div>

    <label class="label-red">Категория менеджеров</label><br>
    <el-select
      v-model="filter.categories"
      multiple
      clearable
      @change="emits('toDirty'); getManagers()"
    >
      <el-option
        v-for="item in roleCategories"
        :key="item.value"
        :label="item.title"
        :value="item.value"
      />
    </el-select>
    <br><br>
    <label class="label-red">Менеджер</label><br>
    <el-select
      v-model="filter.UserIds"
      multiple
      @change="emits('toDirty')"
      clearable
    >
      <el-option
        v-for="item in managers"
        :key="item.id"
        :label="item.title"
        :value="item.id"
      />
    </el-select>
    <br><br>

    <label class="label-red">Вид обращения</label><br>
    <el-select
      v-model="filter.leadTypes"
      multiple
      @change="emits('toDirty')"
      clearable
    >
      <el-option
        v-for="item in workflowLeadTypes"
        :key="item.value"
        :label="item.title"
        :value="item.value"
      />
    </el-select>
    <br><br>

    <div class="block">
      <label class="label-red">Период</label><br>
      <div style="margin: -25px 0 0 105px">
        <el-date-picker
          v-model="filter.lowCreateDatePeriod"
          type="date"
          @change="emits('toDirty')"
          format="DD.MM.YYYY"
          placeholder="От"
        />
        <br>
        <el-date-picker
          v-model="filter.highCreateDatePeriod"
          type="date"
          format="DD.MM.YYYY"
          placeholder="До"
        />
      </div>
    </div>
    <br>
    <el-button type="success" style="float: right" @click="goGetRecord()">
       Сформировать
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useReportStore } from '@/stores/reportStore.ts'
import { useAdminStore } from '@/stores/adminStore.ts'

const adminStore = useAdminStore()
const reportStore = useReportStore()
const globalStore = useGlobalStore()
const organizations = ref([])
const departments = ref([])
const roleCategories = ref([])
const managers = ref([])
const filter = ref<any>({
  OrganizationIds: [],
  DepartmentIds: [],
  categories: [60],
  lowCreateDatePeriod: new Date(new Date().setDate(1)),
  highCreateDatePeriod: new Date()
})
const workflowLeadTypes = ref([])
const emits = defineEmits(['getRecord', 'toDirty'])

function getManagers() {
  let link = ''
  filter.value && filter.value.categories.forEach((el: number) => link += '&categories=' + el)
  globalStore.getUsers(link).then((res) => managers.value = res.items)
}

function goGetRecord(){
  emits('getRecord', filter.value)
}

function getDepartments() {
  console.log(' = ',)
}

onMounted(() => {
  globalStore.setTitle('Витрина')
  globalStore.steps = []
  adminStore.getDepartmentsWithBuyLocations(3).then(res => departments.value = res)
  globalStore.getOrganizations().then(res => organizations.value = res.items)
  globalStore.getWorkflowLeadTypesForDataMart().then(res => workflowLeadTypes.value = res)
  globalStore.getRoleCategories().then(res => {
    roleCategories.value = res.filter((el: any) => [60, 61].includes(el.value))
  })
  getManagers()
  emits('getRecord', filter.value)
})
</script>
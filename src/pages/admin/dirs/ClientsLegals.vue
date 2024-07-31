<template>
  <div>

    <div class="admin-filter-field">
      <el-input v-model="search"
                :prefix-icon="Search"
                placeholder="Поиск"
                @clear="search='';getData()"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"

                @keydown.enter="getData()"/>
      <el-button @click="openModalUserDir()" type="danger" :icon="Plus"> Добавить</el-button>
    </div>

    <el-table
        v-if="!globalStore.isMobileView"
        :data="tableData"
        ref="singleTableRef"
        @row-dblclick="openModalUserDir"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Наименование организации" prop="name" min-width="110"/>
      <el-table-column label="Тип компании" prop="typeOfCompanyTitle" width="100"/>
      <el-table-column label="Тип юр.лица" prop="typeLegalTitle" width="100"/>
      <el-table-column label="ИНН" prop="inn" width="120"/>
      <el-table-column label="КПП" prop="kpp" width="100"/>
      <el-table-column label="Ответственный" min-width="150">
        <template #default="scope">
          {{ scope.row.person.lastName }} {{ scope.row.person.firstName }} {{ scope.row.person.middleName }}
        </template>
      </el-table-column>
      <el-table-column label="Email" prop="person.email" maxWidth="110"/>
      <el-table-column label="Телефон" prop="person.phone" maxWidth="110"/>
      <el-table-column label="Адрес регистрации">
        <template #default="scope">
          <el-checkbox style="pointer-events: none"
                       :checked="scope.row.isRegistrationAddress"/>
        </template>
      </el-table-column>
      <el-table-column label="Почтовый адрес" min-width="80">
        <template #default="scope">
          <el-checkbox style="pointer-events: none" :checked="scope.row.isPostAddress"/>
        </template>
      </el-table-column>
      <el-table-column label="Счет" width="60">
        <template #default="scope">
          <el-checkbox style="pointer-events: none"
                       :checked="scope.row.bills && scope.row.bills.length>0"/>
        </template>
      </el-table-column>

      <el-table-column label="НДС" width="60">
        <template #default="scope">
          <el-checkbox style="pointer-events: none"
                       :checked="scope.row.nds"/>
        </template>
      </el-table-column>


      <el-table-column prop="roleTitle" width="40px">

        <template #default="scope">
          <div style="" class="admin-table-editors">
            <EditPensilCtrl @click="openModalUserDir(scope.row)"/>
          </div>
        </template>
      </el-table-column>


    </el-table>

    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <div><small>Клиент:</small> {{ row.person.lastName }} {{ row.person.firstName }} {{ row.person.middleName }}

          <el-button>
            <EditPensilCtrl @click="openModalUserDir(row)"/>
          </el-button>
        </div>

      </div>
      <div v-if="!total" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="total>2">
      <el-pagination
          v-model:page-size="rowsPerPage"
          :page-sizes="[5, 10, 20, 50]"
          layout="prev, pager, next, sizes"
          @current-change="changePage"
          @size-change="changePageSize"
          :total="total"
      />
      <div class="page-info">Показаны {{ pageDescription }} из {{ total }}</div>
    </template>

  </div>
  <ClientsDirLegalModal ref="UserModal"/>
</template>

<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import ClientsDirLegalModal from "@/pages/admin/dirs/ClientsDirLegalModal.vue";
import {Plus, Search} from "@element-plus/icons-vue";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const UserModal = ref(null)
const tableData = ref([])
const total = ref(0)
const rowsPerPage = ref(10)
const pageDescription = ref('')
const search = ref('')
const filter = {offset: 0, limit: 10, quickSearch: ''}
const activeName = ref('first')

function tabChange(val) {
  console.log('tabChange  val= ', val)


}

function changePageSize() {
  filter.limit = rowsPerPage.value
  getData()
}

function changePage(val: number) {
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
}

function open() {
  getData()
}

function getData() {

  filter.quickSearch = search.value
  globalStore.isWaiting = true
  adminStore.getLegals(filter).then(res => {
    globalStore.isWaiting = false

    console.log('res = ', res)

    res.data.items.map(el => {
      // if (el.person.homeAddress && el.person.homeAddress.fias &&
      //     (el.person.homeAddress.text || el.person.homeAddress.fias.value)
      // ) el.isHomeAddress = true

      if (el.postAddress &&
          (el.postAddress.text ||
              (el.postAddress.fias && el.postAddress.fias.value))
      ) el.isPostAddress = true

      if (el.registrationAddress &&
          (el.registrationAddress.text ||
              (el.registrationAddress.fias && el.registrationAddress.fias.value))
      ) el.isRegistrationAddress = true
    })
    tableData.value = res.data.items
    total.value = res.data.total
  })
}


function openModalUserDir(row: any | null) {
  UserModal.value.open(row, getData)
}


globalStore.setTitle('Клиенты')
globalStore.steps = []

defineExpose({open})

</script>
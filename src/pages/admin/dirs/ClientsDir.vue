<template>
  <div>

    <el-tabs v-model="activeName" @tab-change.once="tabChange">
      <el-tab-pane label="Физ.лица" name="first">
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
          <el-table-column label="Фамилия" prop="person.lastName"/>
          <el-table-column label="Имя" prop="person.firstName"/>
          <el-table-column label="Отчество" prop="person.middleName"/>
          <el-table-column label="Дата рождения" prop="person.dateOfBirth" maxWidth="100"/>
          <el-table-column label="Телефон" prop="person.phone" maxWidth="110"/>
          <el-table-column label="ИНН" prop="person.inn"/>
          <el-table-column label="Адрес регистрации">
            <template #default="scope">
              <el-checkbox style="pointer-events: none"
                           :checked="scope.row.isRegistrationAddress"/>
            </template>
          </el-table-column>
          <el-table-column label="Фактический адрес">
            <template #default="scope">
              <el-checkbox style="pointer-events: none"
                           :checked="scope.row.isHomeAddress"/>
            </template>
          </el-table-column>
          <el-table-column label="Счет">
            <template #default="scope">
              <el-checkbox style="pointer-events: none"
                           :checked="scope.row.bills.length>0"/>
            </template>
          </el-table-column>
          <el-table-column label="Документы" prop="clientDocumentType"/>
          <el-table-column prop="roleTitle" width="120px">

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
      </el-tab-pane>
      <el-tab-pane label="Юр.лица">
        <ClientsLegals ref="clientsLegals"/>
      </el-tab-pane>
    </el-tabs>


  </div>
  <ClientsDirModal ref="сlientsDirModal"/>
</template>

<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {onMounted, ref} from "vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {Plus, Search} from '@element-plus/icons-vue'
import ClientsDirModal from "@/pages/admin/dirs/ClientsDirModal.vue";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import ClientsLegals from "@/pages/admin/dirs/ClientsLegals.vue";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const сlientsDirModal = ref(null)
const tableData = ref([])
const total = ref(0)
const rowsPerPage = ref(10)
const pageDescription = ref('')
const search = ref('')
const filter = {offset: 0, limit: 10, quickSearch: ''}
const activeName = ref('first')
const clientsLegals = ref(null)

function tabChange(val) {
  if (val == 1) clientsLegals.value.open()
}

function changePageSize() {
  filter.limit = rowsPerPage.value
  getData()
}

function changePage(val: number) {
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
}


function getData() {

  filter.quickSearch = search.value
  globalStore.isWaiting = true
  adminStore.getClients(filter).then(res => {
    globalStore.isWaiting = false
    res.data.individuals.map(el => {
      if (el.person.homeAddress && el.person.homeAddress.fias &&
          (el.person.homeAddress.text || el.person.homeAddress.fias.value)
      ) el.isHomeAddress = true

      if (el.person.registrationAddress &&
          (el.person.registrationAddress.text ||
              (el.person.registrationAddress.fias && el.person.registrationAddress.fias.value))
      ) el.isRegistrationAddress = true
    })
    tableData.value = res.data.individuals
    total.value = res.data.totalCount
  })
}


function openModalUserDir(row: any | null) {
  сlientsDirModal.value.open(row.leadId, getData)
}


globalStore.setTitle('Клиенты')
globalStore.steps = []
getData()

</script>
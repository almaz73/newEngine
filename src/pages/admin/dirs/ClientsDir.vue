<template>
  <div>
    <div class="admin-filter-field" style="column-gap: 22px">
      <el-input v-model="search"
                :prefix-icon="Search"
                placeholder="Поиск"
                @clear="search=''"
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
            <img @click="openModalUserDir(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
            <img @click="deleteUser(scope.row.id)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
        </template>
      </el-table-column>


    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <div><small>Клиент:</small> {{ row.person.lastName }} {{ row.person.firstName }} {{ row.person.middleName }}

          <el-button><img @click="openModalUserDir(row)" alt=""
                          title="Редактировать"
                          src="@/assets/icons/icon-pencil-gray.png">
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
  <ClientsDirModal ref="UserModal"/>
</template>

<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {Plus, Search} from '@element-plus/icons-vue'
import ClientsDirModal from "@/pages/admin/dirs/ClientsDirModal.vue";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const UserModal = ref(null)
const tableData = ref([])
const total = ref('')
const rowsPerPage = ref(10)
const pageDescription = ref('')
const search = ref('')
const filter = {offset: 0, limit: 10, quickSearch: ''}


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
              (el.person.registrationAddress.fia && el.person.registrationAddress.fias.value))
      ) el.isRegistrationAddress = true
    })

    tableData.value = res.data.individuals
    total.value = res.data.totalCount
  })
}


function openModalUserDir(row: any | null) {
  UserModal.value.open(row, getData)
}

function deleteUser(id: number) {
  ElMessageBox.confirm('Вы действительно хотите удалить пользователя?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then((res) => {
        res && adminStore.deleteUser(id).then(() => {
          ElMessage({message: 'Пользователь успешно удален', type: 'success'})
          getData()
        })
      })
}


globalStore.setTitle('Клиенты')
globalStore.steps = []
getData()
</script>
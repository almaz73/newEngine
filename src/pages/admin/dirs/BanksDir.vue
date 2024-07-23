<template>
    <div>
        <div style="margin-bottom: 30px">
            <el-input v-model="search" :prefix-icon="Search" @clear="find()" clearable
            placeholder="Фильтр"
                :style="{ marginRight: globalStore.isMobileView ? '80px' : '30px' }" @keydown.enter="find()" />

            <el-button @click="openModal()"  type="danger" :icon="Plus">{{ globalStore.isMobileView ? '' :
                'Добавить' }}
            </el-button>
            <h4 style="color: #999">
            {{
                (isFilialsPage) ?
                    'Филиалы банка: ' + activeBank.name + '.   ( ' + filialsData.length + ' )' :
                    'Все Банки ( ' + banksLength + ')'
            }}
              <el-button v-if="isFilialsPage" @click="showBanks()"  :icon="ArrowLeft">{{ globalStore.isMobileView ? '' :
                  'Вернуться к банкам' }}
              </el-button>
            </h4>
        </div>

        <el-table v-if="!isFilialsPage" :data="tableData" empty-text="Нет данных" highlight-current-row>
            <el-table-column label="Название" prop="name" sortable />

            <el-table-column label="Краткое наименование" prop="shortName" />
            <el-table-column>
                <template #default="scope">
                    <el-button @click.stop="showFilials(scope.row.bankId,scope.row.name)" style="float: right">Филиалы</el-button>
                </template>
            </el-table-column>
            <el-table-column width="73">
                <template #default="scope">
                    <div style="" class="admin-table-editors">
                      <EditPensilCtrl @click="openModal(scope.row)" />
                      <img @click="deleteRow(scope.row.id)" alt=""
                           src="@/assets/icons/icon-cross-gray.png"
                           title="Удалить">
                    </div>

                </template>
            </el-table-column>

        </el-table>
        <el-table v-if="isFilialsPage" :data="filialsData" empty-text="Нет данных" highlight-current-row>
            <el-table-column label="Название" prop="name" sortable />

            <el-table-column label="БИК" prop="bik" />
            <el-table-column label="К/C" prop="correspondentAccount" />
            <el-table-column label="Адресс" prop="registrationAddress.fiasAddress.value" />
            <el-table-column width="73">
                <template #default="scope">
                    <div style="" class="admin-table-editors">
                      <EditPensilCtrl @click="openModal(scope.row)" />
                      <img @click="deleteFilials(scope.row)" alt=""
                           src="@/assets/icons/icon-cross-gray.png"
                           title="Удалить">
                    </div>

                </template>
            </el-table-column>

        </el-table>
    </div>
    <BanksDirModal ref="modal"/>
</template>
<script setup lang="ts">
import { useAdminStore } from "@/stores/adminStore";
import { ref } from "vue";
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { useGlobalStore } from "@/stores/globalStore";
import {ArrowLeft, Search, Plus } from '@element-plus/icons-vue'
import BanksDirModal from "@/pages/admin/dirs/BanksDirModal.vue"
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
const banksLength = ref(0)
const activeBank = ref({})
const filialsData = ref([])
const modal = ref(null)
const BankIdFilials = ref(0)
let tableDataMemory = []
let filialsDataMemory = []
const search = ref('')
const isFilialsPage = ref(false)

function find() {
    if(isFilialsPage.value){
        filialsData.value = filialsDataMemory.filter(el => el.name.toUpperCase().includes(search.value.toUpperCase()))
        if (!search.value) filialsData.value = filialsDataMemory
    }
    else{
        tableData.value = tableDataMemory.filter(el => el.name.toUpperCase().includes(search.value.toUpperCase()))
        if (!search.value) tableData.value = tableDataMemory
    }

}

function showFilials(id: number, name: string){
    activeBank.value.name = name
    activeBank.value.id = id
    getFilials(id)
    isFilialsPage.value = true
    search.value = ''
}
function showBanks(){
    getData()
    isFilialsPage.value = false
    filialsDataMemory = []
    filialsData.value = []
    search.value = ''
}


function openModal(row: any | null) {
  modal.value.open(row, getData, isFilialsPage.value, activeBank.value.id)
}

function deleteRow(row: any) {
    ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then(() => {
          adminStore.deleteBanks(row.id).then(() => {
            ElMessage({message: 'Банк удален.', type: 'success'})
            getData()
          })
        })
        .catch(() => {
        })
}

function deleteFilials(row){
    ElMessageBox.confirm('Вы действительно хотите удалить филиал?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then(() => {
            adminStore.deleteBankFilials(row.id).then(() => {
            ElMessage({message: 'Филиал удален.', type: 'success'})
            getFilials()
          })
        })
        .catch(() => {
        })

}

function getData() {
    globalStore.isWaiting = true
    adminStore.getBanks().then(res => {
        globalStore.isWaiting = false
        tableData.value = res.items
        banksLength.value = res.count
        tableDataMemory = JSON.parse(JSON.stringify(res.items))
    })
}
function getFilials(id:number = BankIdFilials.value) {
    globalStore.isWaiting = true
    BankIdFilials.value = id
    adminStore.getBankFilials(id).then(res => {
        globalStore.isWaiting = false
        filialsData.value = res.items
        filialsDataMemory = JSON.parse(JSON.stringify(res.items))
    })
}

globalStore.setTitle('Банки')
globalStore.steps = []
getData()


</script>
<template>
    <div>
        <div style="margin-bottom: 30px">
            <el-input v-model="search" :prefix-icon="Search" @clear="find()" clearable
                :style="{ marginRight: globalStore.isMobileView ? '80px' : '30px' }" @keydown.enter="find()" />
            <el-button @click="add()" :disabled="isEdit" type="danger" :icon="Plus">{{ globalStore.isMobileView ? '' :
                'Добавить' }}
            </el-button>
            <span v-if="globalStore.isMobileView && isEdit"><br><br></span>
            <el-button v-if="isEdit" @click="save()">Сохранить</el-button>
            <el-button v-if="isEdit" @click="selectedRow = isEdit = false">Сброс</el-button>
        </div>

        <el-table :data="tableData" empty-text="Нет данных" highlight-current-row>
            <el-table-column label="Название" prop="name" sortable>
                <template #default="scope">
                    <el-input autofocus v-if="isEdit && selectedRow.id === scope.row.id"
                        v-model="scope.row.name"></el-input>
                    <span v-else>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Краткое наименование" prop="shortName">
                <template #default="scope">
                    <el-input autofocus v-if="isEdit && selectedRow.id === scope.row.id"
                        v-model="scope.row.shortName"></el-input>
                    <span v-else>{{ scope.row.shortName }}</span>
                </template>
            </el-table-column>

            <el-table-column width="73">
                <template #default="scope">
                    <el-icon @click="edit(scope.row)" style="cursor: pointer">
                        <EditPen />
                    </el-icon>
                    &nbsp;
                    <el-icon style="cursor: pointer" @click="deleteRow(scope.row)">
                        <CloseBold />
                    </el-icon>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>
<script setup lang="ts">
import { useAdminStore } from "@/stores/adminStore";
import { ref } from "vue";
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { useGlobalStore } from "@/stores/globalStore";
import { EditPen, CloseBold, Search, Plus } from '@element-plus/icons-vue'

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
let tableDataMemory = []
const search = ref('')
const isEdit = ref(false)
const selectedRow = ref(false)

function find() {
    tableData.value = tableDataMemory.filter(el => el.name.toUpperCase().includes(search.value.toUpperCase()))
    if (!search.value) tableData.value = tableDataMemory
}

function edit(row) {
    selectedRow.value = row
    isEdit.value = true
}

function save() {

    let row = tableData.value.find(el => !el.id)
    console.log(row)
    if(row === undefined){
        row = selectedRow.value
        row.bankId = selectedRow.value.id
    }
    
    adminStore.saveBanks(row).then(() => {
        ElMessage({ message: 'Банк сохранен.', type: 'success' })
        getData()
    })
}

function add() {
    tableData.value.unshift({ name: '', shortName: '' })
    isEdit.value = true
}

function deleteRow(row: any) {
    ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then(() => {
          adminStore.deleteBanks(row.id).then(res => {
            ElMessage({message: 'Банк удален.', type: 'success'})
            getData()
          })
        })
        .catch(() => {
        })
}

function getData() {
    isEdit.value = false
    selectedRow.value = false
    globalStore.isWaiting = true
    adminStore.getBanks().then(res => {
        globalStore.isWaiting = false
        tableData.value = res.result
        tableDataMemory = JSON.parse(JSON.stringify(res.result))
    })
}

globalStore.setTitle('Банки')
globalStore.steps = []
getData()


</script>
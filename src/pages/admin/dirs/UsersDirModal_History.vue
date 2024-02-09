<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 730"
            :top="50"
            :title="'История изменений'"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">

      <el-table
          style="margin-top: 24px"
          v-if="!globalStore.isMobileView"
          :data="tableData"
          empty-text="Нет данных"
          highlight-current-row
      >
        <el-table-column label="Дата" width="100">
          <template #default="scope">
            {{ formatDMY_hm(scope.row.createDate) }}
          </template>
        </el-table-column>
        <el-table-column label="Изменил" prop="" width="120">
          <template #default="scope">
            {{ scope.row.user.person.lastName + ' ' + scope.row.user.person.firstName }}
          </template>
        </el-table-column>
        <el-table-column label="Изменения">
          <template #default="scope">
            <div v-html="listChange(scope.row.differences)"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="vertical-table" v-if="globalStore.isMobileView">
        <div v-for="(row, ind) in tableData"
             :key="ind" style="border-top:5px double #ddd">
          <div>{{ formatDMY_hm(row.createDate) }}</div>
          <div style="color:#f13d03">{{ row.user.person.lastName + ' ' + row.user.person.firstName }}</div>
          <div v-html="listChange(row.differences)"/>
        </div>
      </div>
    </el-scrollbar>
  </AppModal>
</template>
<style>


</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {formatDMY_hm} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const isOpen = ref(false)
const tableData = ref([])
const closeModal = () => isOpen.value = false
const adminStore = useAdminStore()
const subtitle = ref('')

function open(user) {
  user.value = user
  isOpen.value = true
  subtitle.value = ''
  if (user.person.firstName) subtitle.value += user.person.firstName + ' '
  if (user.person.middleName) subtitle.value += user.person.middleName + ' '
  if (user.person.lastName) subtitle.value += user.person.lastName + ' '

  adminStore.getUserHistory(user.id).then(res => {
    console.log(res)
    tableData.value = res.items
  })
}

function listChange(list) {
  let txt = ''
  list.forEach(item => {
    txt += ' <b>' + item.description + ':</b> ' + item.oldValue + ' ➔  ' + item.newValue + '<br>'
  })
  return txt

}


defineExpose({open})

</script>
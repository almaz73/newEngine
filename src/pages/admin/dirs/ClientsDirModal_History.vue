<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 730"
            :top="50"
            :title="title"
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
            <div v-html="listChange(scope.row.differences)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="vertical-table" v-if="globalStore.isMobileView">
        <div v-for="(row, ind) in tableData"
             :key="ind" style="border-top:5px double #ddd">
          <div>{{ formatDMY_hm(row.createDate) }}</div>
          <div style="color:#d34338">{{ row.user.person.lastName + ' ' + row.user.person.firstName }}</div>
          <div v-html="listChange(row.differences)" />
        </div>
      </div>
    </el-scrollbar>
  </AppModal>
</template>

<script setup>
/**
 * История измеенний клиента / юридического лица
 */
import AppModal from '@/components/AppModal.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useAdminStore } from '@/stores/adminStore'
import { ref } from 'vue'
import { formatDMY_hm } from '@/utils/globalFunctions'

const globalStore = useGlobalStore()
const isOpen = ref(false)
const tableData = ref([])
const closeModal = () => isOpen.value = false
const adminStore = useAdminStore()
const title = ref('')
const subtitle = ref('')

function open(type, id, name, method) {
  isOpen.value = true
  title.value = 'История изменений ' + type
  subtitle.value = name

  adminStore[method](id).then(res => tableData.value = res.data)
}

function listChange(list) {
  let txt = ''
  list.forEach(item => {
    txt += ' <b>' + item.description + ' : </b> ' +
      '<span class="border-val">' + item.oldValue + '</span> ➔  <span class="border-val">' +
      item.newValue + '</span><br>'
  })
  return txt

}


defineExpose({ open })

</script>
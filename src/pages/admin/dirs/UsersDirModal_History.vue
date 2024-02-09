<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 730"
            :top="40"
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
        <el-table-column label="Дата">
          <template #default="scope">
            {{ formatDMY_hm(scope.row.createDate) }}
          </template>
        </el-table-column>
        <el-table-column label="Изменил" prop="user.person.firstName"/>
      </el-table>

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

  if (user.person.firstName) subtitle.value += user.person.firstName + ' '
  if (user.person.middleName) subtitle.value += user.person.middleName + ' '
  if (user.person.lastName) subtitle.value += user.person.lastName + ' '

  adminStore.getUserHistory(user.id).then(res => {
    console.log(res)
    tableData.value = res.items
  })
}


defineExpose({open})

</script>
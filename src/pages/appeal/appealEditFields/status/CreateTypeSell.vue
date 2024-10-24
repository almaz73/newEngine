<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
           <label class="label">Ответственный</label>
            <el-select
              title="Тип"
              placeholder="Выберите ответственного"
              v-model="mod.repson"
              filterable
              clearable>
              <el-option v-for="item in persons" :key="item.id"
                         :label="item.person.firstName + ' ' +item.person.lastName"
                         :value="item.id" />
            </el-select>

            <label class="label">Комментарий</label>
            <el-input
              v-model="mod.comment"
              type="textarea"
              placeholder="Введите комментарий">
           </el-input>

          <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
         <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </span>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from '@/components/AppModal.vue'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAppealStoreStatus } from '@/stores/appealStoreStatus'
import { useGlobalStore } from '@/stores/globalStore'
import { useDesktopStore } from '@/stores/desktopStore'

const desktopStore = useDesktopStore()
const globalStore = useGlobalStore()
const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false)
const mod = ref({ person: null })
const closeModal = () => isOpen.value = false
const persons = ref([])

function open(val, appeal) {
  mod.value.yearReleased = appeal.yearReleased
  mod.value.workflowLeadType = appeal.workflowLeadType
  if (appeal.lead) mod.value.leadId = appeal.lead.leadId
  mod.value.carModelId = appeal.lead.carModelId
  mod.value = val
  mod.value.appealId = appeal.id
  isOpen.value = true


  appealStoreStatus.getUsersSearch([50, 51, 52]).then(res => {
    persons.value = res.data.items
  })
}

function save() {
  if (!mod.value.person) return ElMessage.warning('Поле "Ответственный" обязателен для заполнения')

  let params = {
    carModelId: mod.value.carModelId,
    lead: { leadId: mod.value.leadId },
    managerId: mod.value.repson,
    treatmentSourceTitle: 'Отдел выкупа',
    workflowLeadType: mod.value.workflowLeadType,
    yearReleased: mod.value.yearReleased
  }

  desktopStore.saveAppeal(params).then(res => {
    globalStore.isWaiting = false
    if (res.status === 200) location.reload()
  })
}

defineExpose({ open })


</script>
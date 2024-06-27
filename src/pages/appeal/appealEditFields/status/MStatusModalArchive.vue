<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
           <label class="label l_300">Причина архивирования</label>
            <el-select
                title="Тип"
                placeholder="Тип"
                v-model="mod.type"
                style="width: 200px; margin:0 20px 0 10px"
                filterable
                multiple
                clearable>
              <el-option v-for="item in types" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>

            <label class="label">Комментарий</label>
            <el-input
                v-model="mod.comment"
                type="textarea"
                placeholder="Введите комментарий">
           </el-input>

          <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
         <el-button type="info" @click="cb(false); isOpen = false">Отмена</el-button>
        </span>
        </span>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";
import {useGlobalStore} from "@/stores/globalStore";

const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false);
const mod = ref({type: []});
const closeModal = () => isOpen.value = false;
let cb;
const types = ref([])

function open(val, appeal, cbModal) {
  mod.value = val
  mod.value.appealId = appeal.id
  mod.value.workflowLeadType = appeal.workflowLeadType
  cb = cbModal;
  isOpen.value = true;

  appealStoreStatus.getReasonTemplates(appeal.workflowLeadType).then(res => {
    types.value = res.items
  })

  appealStoreStatus.getAppealArchiveRequestReasons(appeal.id).then(res => {
    mod.value.type = res.reasons
  })
}

function save() {
  if (!mod.value.type) return ElMessage.warning('Не указана причина')
  let params = {
    comment: mod.value.comment,
    id: mod.value.appealId,
    status: mod.value.id,
    reason: mod.value.type
  }

  useGlobalStore().isWaiting = true
  appealStoreStatus.setArchive(params).then(() => {
    isOpen.value = false
    location.reload()
  })
}

defineExpose({open});


</script>
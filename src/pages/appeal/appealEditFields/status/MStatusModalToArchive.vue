<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
           <label class="label l_300">Причина запроса в архив</label>
            <el-select
                placeholder="Выберите несколько значений"
                v-model="mod.type"
                filterable
                multiple
                clearable>
              <el-option v-for="item in types" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
<br><br>
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
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";
import {ElMessage} from "element-plus";

const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false);
const mod = ref({type: []});
const closeModal = () => isOpen.value = false;
const types = ref([])
let cb;

function open(val, appeal, cbModal) {
  mod.value = val
  mod.value.appealId = appeal.id
  cb = cbModal;
  isOpen.value = true;

  appealStoreStatus.getReasonTemplates(appeal.workflowLeadType).then(res => {
    types.value = res.items
  })
}

function save() {
  if (!mod.value.type.length) return ElMessage.warning('Не указана причина')
  let params = {
    comment: mod.value.comment,
    id: mod.value.appealId,
    status: mod.value.id,
    reasons: mod.value.type
  }

  useGlobalStore().isWaiting = true
  appealStoreStatus.setToArchive(params).then(() => {
    isOpen.value = false
    location.reload()
  })
}


defineExpose({open});


</script>
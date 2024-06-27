<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
          Для изменения типа сделки необходимо указать вид выкупа

            <el-select
                title="вид выкупа"
                placeholder="Выберите вид выкупа"
                v-model="mod.type"
                filterable
                clearable>
              <el-option v-for="item in BuyCategoryTypes" :key="item.id" :label="item.title" :value="item.id"/>
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
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";
import {ElMessage} from "element-plus";
import {BuyCategoryTypes} from "@/utils/globalConstants";

const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false);
const mod = ref({});
const closeModal = () => isOpen.value = false;
let cb;

function open(val, appeal, cbModal) {
  mod.value = val
  mod.value.appealId = appeal.id
  cb = cbModal;
  isOpen.value = true;

}

function save() {

  if(!mod.value.type) return ElMessage.warning('Поле "Вид выкупа" обязателен для заполнения')
  let params = {
    comment: mod.value.comment,
    appealId: mod.value.appealId,
    buyCategory: mod.value.type
  }

  useGlobalStore().isWaiting = true
  appealStoreStatus.setBuyCategory(params).then(() => {
    isOpen.value = false
    location.reload()
  })
}


defineExpose({open});


</script>
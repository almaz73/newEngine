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
           <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </span>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from '@/stores/globalStore'
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";
import {ElMessage} from "element-plus";
import {BuyCategoryTypes} from "@/utils/globalConstants";

const globalStore=useGlobalStore()
const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false);
const mod = ref({});
const closeModal = () => isOpen.value = false;

function open(val, appeal) {
  mod.value = val
  mod.value.appealId = appeal.id
  isOpen.value = true;

}

function save() {

  if(!mod.value.type) return ElMessage.warning('Поле "Вид выкупа" обязателен для заполнения')
  let params = {
    // comment: mod.value.comment,
    appealId: mod.value.appealId,
    buyCategory: mod.value.type
  }

  globalStore.isWaiting = true
  appealStoreStatus.setBuyCategory(params).then(res => {
    globalStore.isWaiting = false
    if (res.status === 200) location.reload()
  })
}


defineExpose({open});


</script>
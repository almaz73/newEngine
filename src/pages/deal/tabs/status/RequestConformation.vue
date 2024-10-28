<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
          <label class="label l_300">Договорная цена выкупа</label>
            <el-input
                type="number"
                @input="()=>{mod.price=parseInt(mod.price)}"
                style="width: 180px;"
                v-model="mod.priceDemanded"
                placeholder="Введите цену">
            </el-input>

          <br><br>
            <label class="label-right l_100">Комментарий</label>
            <el-input
                v-model="mod.comment"
                type="textarea"
                placeholder="Введите комментарий >20 символов">
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
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";
import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from "@/stores/dealStore";

const globalStore=useGlobalStore()
const dealStore = useDealStore()
const isOpen = ref(false);
const mod = ref({});
const closeModal = () => isOpen.value = false;

function open(val, appeal) {
  mod.value = val
  mod.value.dealId = appeal
  isOpen.value = true;
}

function save() {
  console.log(mod.value)
  let params = {
    comment: mod.value.comment,
    buyId: mod.value.dealId,
    newStatus: mod.value.id,
    priceDemanded: Number(mod.value.priceDemanded)
  }

  globalStore.isWaiting = true
  dealStore.setConfirmation(params).then(res => {
    globalStore.isWaiting = false
    isOpen.value = false
    if (res.status === 200) location.reload()
  })

}


defineExpose({open});


</script>
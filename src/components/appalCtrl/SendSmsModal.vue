<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 600"
            :top="73"
            :title="'Отправить sms на номер: '+appeal.leadPhone"
            :subtitle="' Клиент: '+ appeal.leadName "
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <el-select
          v-model="smsTemplate"
          :filterable="!globalStore.isMobileView"
          clearable
      >
        <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
      </el-select>
      &nbsp; &nbsp;
      <el-date-picker
          v-model="smsDate"
          type="datetime"
          placeholder="Выберите время"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="MMM DD, YYYY"
          time-format="HH:mm"
      />

      <el-input v-model="smsText" type="textarea"/>
      <br>
      <el-button :disabled='!isReady'
                 @click="sendSMS()"
                 :type="isReady?'danger':''">
        Отправить СМС
      </el-button>
      <el-button @click="clear()"> Отмена</el-button>
      <br>
    </el-scrollbar>
  </AppModal>
</template>


<script setup>
import AppModal from "@/components/AppModal.vue";
import {computed, ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ElMessage} from "element-plus";

const props = defineProps(['appealId'])
const closeModal = () => isOpen.value = false
const appealStore = useAppealStore()
const globalStore = useGlobalStore()
const smsText = ref('')
const smsTemplates = ref([])
const smsTemplate = ref(null)
const smsDate = ref(null)
const isReady = computed(() => smsDate.value && smsTemplate.value)
const isOpen = ref(false)
const appeal = ref(null)
let cb;


function clear() {
  smsTemplate.value = null
  smsText.value = ''
  smsDate.value = null
  isOpen.value = false
}

function sendSMS() {
  if (smsDate.value < new Date()) return ElMessage({message: 'Выбранная дата меньше текущей', type: 'warning'})

  let param = {
    templateId: smsTemplate.value,
    appealId: appeal.value.id,
    comment: smsText.value,
    meetDate: smsDate.value.toLocaleString().replace(',', ''),
  }
  appealStore.sendSMS(param).then(clear)
}

function open(row, cbModal) {
  cb = cbModal
  appeal.value = row
  isOpen.value = true
  appealStore.getSmsTemplates().then(res => smsTemplates.value = res.items)
}

defineExpose({open});

</script>
<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 600"
            :top="73"
            :title="'Отправить СМС на номер: '+appeal.leadPhone"
            :subtitle="' Клиент: '+ appeal.leadName "
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <small>
        <label class="label-red label-right" style="width: 200px">Шаблон сообщения:</label>
        <el-select
            style="width: 200px"
            v-model="smsTemplate"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeTeplate()"
        >
          <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
        </el-select>
      </small>
      <br>
      <small>
        <label class="label-red label-right" style="width: 200px">Текст отправляемой смс:</label>
        <el-input v-model="txtSms" readonly type="textarea"  resize="none"/>
      </small>
      <br><br>
      <small>
        <label class="label-red label-right" style="width: 200px">Дата встречи:</label>
        <el-date-picker
            v-model="smsDate"
            type="datetime"
            @change="checkDate()"
            placeholder="Выберите время"
            format="DD.MM.YYYY HH:mm"
            date-format="DD.MM.YYYY"
            time-format="HH:mm"
        />
      </small>
      <div>
        <el-input v-model="smsText" type="textarea" placeholder="Комментарий"/>
      </div>
      <br>
    </el-scrollbar>
    <div style="text-align: right">
      <el-button type="danger" :disabled='!isReady' @click="sendSMS()" :icon="Plus">Отправить СМС</el-button>
      <el-button type="info" @click="clear()">Отмена</el-button>
    </div>
  </AppModal>
</template>

<style>
.el-popper .el-input__inner {
  width: 73px !important;
}
</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {computed, ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ElMessage} from "element-plus";
import {Plus} from "@element-plus/icons-vue";
import {formatDMY_hm} from "@/utils/globalFunctions";

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

const txtSms = ref('')


function clear() {
  smsTemplate.value = null
  smsText.value = ''
  smsDate.value = null
  isOpen.value = false
  txtSms.value = ''
  cb('moCach')
}


function changeTeplate() {
  let tx = smsTemplates.value.find(el => el.id === smsTemplate.value)
  txtSms.value = tx && tx.text
  if (txtSms.value) {
    txtSms.value = txtSms.value.replace('[appealId]', appeal.value.id)
    txtSms.value = txtSms.value.replace('[meetDate]', formatDMY_hm(smsDate.value))
    txtSms.value = txtSms.value.replace('[appealManagerName]', appeal.value.managerName)
  }
}

function checkDate() {
  if (smsDate.value < new Date()) return ElMessage({message: 'Выбранная дата меньше текущей', type: 'warning'})
  changeTeplate()
}

function sendSMS() {
  if (checkDate()) return false

  let param = {
    templateId: smsTemplate.value,
    appealId: appeal.value.id,
    comment: smsText.value,
    meetDate: smsDate.value.toLocaleString().replace(',', ''),
  }
  appealStore.sendSMS(param).then(res => {
    if (res.code === "ERR_BAD_REQUEST") {
      return ElMessage({message: res.response.data.errorText, type: 'warning'})
    }
    clear()
  })
}

function open(row, cbModal) {
  cb = cbModal
  appeal.value = row
  isOpen.value = true
  appealStore.getSmsTemplates().then(res => smsTemplates.value = res.items)
}

defineExpose({open});

</script>
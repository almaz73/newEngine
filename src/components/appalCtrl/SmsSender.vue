<template>
  <div class="smsPanel" :class="isShow?'show':''">
    <el-select
        size="small"
        v-model="smsTemplate"
        :filterable="!globalStore.isMobileView"
        clearable
    >
      <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
    </el-select>
    &nbsp; &nbsp;
    <el-date-picker
        size="small"
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
               size="small"
               @click="sendSMS()"
               :type="isReady?'danger':''">
      Отправить СМС
    </el-button>
    <el-button size="small" @click="clear()"> Отмена</el-button>
    <br>
  </div>
</template>


<script setup>

import {computed, ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ElMessage} from "element-plus";

const props = defineProps(['appealId'])

const appealStore = useAppealStore()
const globalStore = useGlobalStore()
const smsText = ref('')
const smsTemplates = ref([])
const smsTemplate = ref(null)
const smsDate = ref(null)
const isShow = ref(false)
const isReady = computed(() => smsDate.value && smsTemplate.value)

function open() {
  isShow.value = true
  appealStore.getSmsTemplates().then(res => smsTemplates.value = res.items)
}

function clear() {
  smsTemplate.value = null
  smsText.value = ''
  smsDate.value = null
  isShow.value = false
}

function sendSMS() {
  if (smsDate.value < new Date()) return ElMessage({message: 'Выбранная дата меньше текущей', type: 'warning'})

  let param = {
    templateId: smsTemplate.value,
    appealId: props.appealId,
    comment: smsText.value,
    meetDate: smsDate.value.toLocaleString().replace(',', ''),
  }
  appealStore.sendSMS(param).then(clear)
}

defineExpose({open})

</script>
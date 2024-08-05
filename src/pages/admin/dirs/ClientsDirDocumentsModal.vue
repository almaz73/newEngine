<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 530"
            :top="50"
            :title="'Документы клиента'"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">
      <div v-if="clientDocuments && clientDocuments.length">
        <div v-for="doc in clientDocuments" :key="doc.id"
             :style="{'fontWeight': !doc.number?'600':''}">
          <div v-if="!doc.deleted">
            <div>
              <small class="label l_150">Тип документа</small>
              <el-select
                  style="width: 200px;"
                  placeholder=""
                  v-model="doc.type"
                  filterable
                  clearable>
                <el-option v-for="item in documentTypes" :key="item.value" :label="item.title"
                           :value="item.value"/>
              </el-select>

            </div>

            <div>
              <small class="label l_150">Серия</small>
              <el-input maxlength="20"
                        v-model="doc.serial"/>
            </div>

            <div>
              <small class="label l_150">Номер</small>
              <el-input maxlength="20"
                        v-model="doc.number"/>

            </div>

            <div>
              <small class="label l_150">Дата выдачи</small>
              <el-date-picker
                  format="DD.MM.YYYY"
                  value-format="DD.MM.YYYY"
                  placeholder=""
                  v-model="doc.issueDate"/>
              <el-button @click="deleteDocument(doc)" title="Удалить" :icon="Minus"
                         style="margin-left: 30px;"></el-button>
              <el-button @click="addDocument()" title="Добавить" :icon="Plus"></el-button>
            </div>


            <hr>
          </div>
        </div>
      </div>
      <div v-else> Нет документов &nbsp;
        <el-button @click="addDocument(doc)" :icon="Plus">Добавить</el-button>
      </div>
    </el-scrollbar>
    <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()">Сохранить</el-button>
          <el-button type="info" @click="closeModal()">Отмена</el-button>
          <el-button type="info" @click="showHistory()" title="История изменений">⟲</el-button>
        </span>
  </AppModal>
  <ClientsDirModal_History ref="сlientsDirModal_History"/>
</template>

<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import {useAdminStore} from "@/stores/adminStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import ClientsDirModal_History from "@/pages/admin/dirs/ClientsDirModal_History.vue";
import {Minus, Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const isOpen = ref(false)
const subtitle = ref(null)
const documentTypes = ref([])
const clientDocuments = ref([])
const сlientsDirModal_History = ref(null)
let cb = null
let clientId = null
let leadId = null
const closeModal = () => {
  isOpen.value = false
  cb(clientId)
}

function open(row, docs, cbModal) {
  cb = cbModal
  clientId = row.person.id
  leadId = row.leadId
  clientDocuments.value = docs
  isOpen.value = true
  subtitle.value = (row.person.lastName || '') + ' ' + (row.person.firstName || '') + ' ' + (row.person.middleName || '')
  adminStore.getDocumentTypes().then(res => documentTypes.value = res.items)
  adminStore.getClientDocunets(clientId).then(res => clientDocuments.value = res.items)
}

function addDocument() {
  clientDocuments.value.push({number: '', serial: '', type: null, issueDate: null})
}

function deleteDocument(doc) {
  clientDocuments.value = clientDocuments.value.filter(el => {
    if (el.id) return el.id !== doc.id
    else return el.type !== doc.type
  })
}


function showHistory() {
  сlientsDirModal_History.value.open('документов клиента', leadId, subtitle.value, 'getClientDocHistory')
}

function prepare() {
  clientDocuments.value.map(doc => {
    doc.personId = doc.personId || clientId
    doc.id = doc.id || 0
    doc.code = "string"
    if (!doc.deleted) doc.deleted = false
    console.log('doc.type = ', doc.type)
    if (doc.type === 40) {
      if (doc.number.serial !== 4) ElMessage.warning('Серия содержит неверное количество цифр, ожидается  4')
      if (doc.number.length !== 6) ElMessage.warning('Номер содержит неверное количество цифр, ожидается  6')
    }

    return doc
  })
}

function save() {
  prepare()
  globalStore.saveClientDocument(clientDocuments.value).then(res => {
    res.status === 200 && ElMessage({message: 'Успешно сохранено.', type: 'success'})
  })
}

defineExpose({open})


</script>
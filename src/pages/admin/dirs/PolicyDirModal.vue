<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="340"
            :top="40"
            :title="'Политика'"
            draggable>
    <el-scrollbar maxHeight="480px">
      <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields">
            <el-form-item prop="title" :rules="{required: true, message: 'Название', trigger: ['change']}">
                 <label class="label-right l_100">Название</label>
                 <el-input v-model="model.title" />
          </el-form-item>
             <label class="label-right l_100">Описание</label>
             <el-input v-model="model.description" />
          <el-form-item prop="typeTitle" :rules="{required: true, message: 'Тип', trigger: ['change']}">
              <label class="label-right l_100">Тип</label>
              <el-select
                style="width: 190px"
                placeholder="Тип"
                v-model="model.typeTitle"
                filterable
                clearable>
                <el-option v-for="item in blocks" :key="item.id" :label="item.name"
                           :value="item.id" />
             </el-select>
          </el-form-item>
          <el-form-item prop="sectionTitle" :rules="{required: true, message: 'Раздел', trigger: ['change']}">
            <label class="label-right l_100">Раздел</label>
            <el-select
              style="width: 190px"
              title="Раздел"
              placeholder="Раздел"
              v-model="model.sectionTitle"
              filterable
              clearable>
              <el-option v-for="item in departments" :key="item.id" :label="item.name"
                         :value="item.id" />
           </el-select>
          </el-form-item>
          <el-form-item prop="itemTitle" :rules="{required: true, message: 'Элемент', trigger: ['change']}">
            <label class="label-right l_100">Элемент</label>
            <el-select
              style="width: 190px"
              title="Элемент"
              placeholder="Элемент"
              v-model="model.itemTitle"
              filterable
              clearable>
              <el-option v-for="item in departments" :key="item.id" :label="item.name"
                         :value="item.id" />
           </el-select>
          </el-form-item>

           <el-form-item
             v-if="model.id"
             prop="itemTitle" :rules="{required: true, message: 'Значение', trigger: ['change']}">
            <label class="label-right l_100">Значение</label>
            <el-select
              style="width: 190px"
              title="Значение"
              placeholder="Значение"
              v-model="model.itemTitle"
              filterable
              clearable>
              <el-option v-for="item in values" :key="item.id" :label="item.name"
                         :value="item.id" />
           </el-select>
          </el-form-item>
  
          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
        </span>
      </el-form>
    </el-scrollbar>
  </AppModal>
</template>

<script setup>
import AppModal from '@/components/AppModal.vue'
import { useAdminStore } from '@/stores/adminStore'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { checkEmptyFields } from '@/utils/globalFunctions'

const departments = ref([])
const isOpen = ref(false)
const model = ref({})
const closeModal = () => isOpen.value = false
const form = ref(null)
const adminStore = useAdminStore()
const blocks = [
  { id: 10, name: 'Значение по умолчанию' },
  { id: 20, name: 'Блокировка параметра' },
  { id: 30, name: 'Добавление параметра' }
]
const values = ref([])
let cb


function open(row, cbModal) {
  cb = cbModal
  isOpen.value = true

  if (row) model.value = JSON.parse(JSON.stringify(row))

}


function save() {
  checkEmptyFields(form.value).then(res => {
    res && adminStore.savePolicy(model.value).then(() => {
      ElMessage({ message: 'Политика успешно сохранена', type: 'success' })
      isOpen.value = false
      cb('noCach')
    })
  })

}

defineExpose({ open })

</script>
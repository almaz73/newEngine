<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="'Политика'"
            draggable>
    <el-scrollbar maxHeight="480px">
      <el-form ref="form" :model="model" class="error-to-message">
        <div class="modal-fields">
            <el-form-item prop="title" :rules="{required: true, message: 'Название', trigger: ['change']}">
                 <label class="label-right l_100">Название</label>
                 <el-input v-model="model.title" />
          </el-form-item>
             <label class="label-right l_100">Описание</label>
             <el-input v-model="model.description" />
          <el-form-item prop="type" :rules="{required: true, message: 'Тип', trigger: ['change']}">
              <label class="label-right l_100">Тип</label>
              <el-select
                style="width: 190px"
                placeholder="Тип"
                v-model="model.type"
                filterable
                clearable>
                <el-option v-for="item in blocks" :key="item.id" :label="item.name"
                           :value="item.id" />
             </el-select>
          </el-form-item>
          <el-form-item prop="section" :rules="{required: true, message: 'Раздел', trigger: ['change']}">
            <label class="label-right l_100">Раздел</label>
            <el-select
              style="width: 190px"
              title="Раздел"
              placeholder="Раздел"
              v-model="model.section"
              filterable
              clearable>
              <el-option v-for="item in sections" :key="item.id" :label="item.name"
                         :value="item.id" />
           </el-select>
          </el-form-item>
          <el-form-item prop="item" :rules="{required: true, message: 'Элемент', trigger: ['change']}">
            <label class="label-right l_100">Элемент</label>
            <el-select
              style="width: 190px"
              title="Элемент"
              placeholder="Элемент"
              v-model="model.item"
              filterable
              clearable>
              <el-option v-for="item in elementsById" :key="item.id" :label="item.name"
                         :value="item.id" />
           </el-select>
          </el-form-item>

           <el-form-item
             v-if="model.id"
             prop="item" :rules="{required: true, message: 'Значение', trigger: ['change']}">
            <label class="label-right l_100">Значение</label>
            <el-select
              disabled
              style="width: 190px"
              title="Значение"
              placeholder="Значение"
              v-model="model.item"
              filterable
              clearable>
              <el-option v-for="item in elementsById" :key="item.id" :label="item.name"
                         :value="item.id" />
           </el-select>
          </el-form-item>
  
          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
        </div>
      </el-form>
    </el-scrollbar>
  </AppModal>
</template>

<script setup>
import AppModal from '@/components/AppModal.vue'
import { useAdminStore } from '@/stores/adminStore'
import { ref,computed } from 'vue'
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
const sections = [
  { id: 10, name: 'Рабочий стол' },
  { id: 20, name: 'Таблица обращений' },
  { id: 30, name: 'Система' },
  { id: 40, name: 'Реализация' }
]
const elements = {
  10: [
    { id: 10, name: "Тип коммуникации" },
    { id: 11, name: "Тип обращения" },
    { id: 14, name: "Город" }
  ],
  20: [
    { id: 12, name: "Добавление обращения" }
  ],
  30: [
    { id: 13, name: "Организация" },
    { id: 16, name: "Отдел" }
  ],
  40: [
    { id: 15, name: "Изменение цены" }
  ]
};
const values = ref([])
let cb


function open(row, cbModal) {
  cb = cbModal
  isOpen.value = true
  if (row) model.value = JSON.parse(JSON.stringify(row))

}
const elementsById = computed(() => {
      return elements[model.value.section] || [];
});

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